import logging
import os

from flask import Blueprint, jsonify, request
from sqlalchemy import func

from ..models import Product
from ..services.quickcommerceapi import fetch_products, transform_product, QuickCommerceAPIError
from ..utils import error, get_json, parse_float, require_api_key
from .. import db

logger = logging.getLogger(__name__)

bp = Blueprint("products", __name__)


@bp.route("/api/products", methods=["GET"], strict_slashes=False)
def list_products():
    search = (request.args.get("search") or "").strip()
    category = (request.args.get("category") or "").strip()
    source = (request.args.get("source") or "").strip()

    q = Product.query

    if source:
        q = q.filter(func.lower(Product.source).like(f"{source.lower()}%"))

    if search:
        like = f"%{search.lower()}%"
        q = q.filter(
            func.lower(Product.name).like(like) |
            func.lower(Product.brand).like(like)
        )

    if category:
        q = q.filter(func.lower(Product.category) == category.lower())

    products = q.order_by(Product.last_synced.desc()).limit(200).all()

    return jsonify([p.to_dict() for p in products])


@bp.route("/api/sync/quickcommerce", methods=["POST"], strict_slashes=False)
def sync_products_from_quickcommerce():
    data = get_json()

    query = (data.get("query") or "").strip()
    platform = (
        data.get("platform")
        or os.getenv("QUICKCOMMERCE_DEFAULT_PLATFORM")
        or "BlinkIt"
    )
    lat = parse_float(
        data.get("lat") or os.getenv("QUICKCOMMERCE_DEFAULT_LAT")
    )
    lon = parse_float(
        data.get("lon") or os.getenv("QUICKCOMMERCE_DEFAULT_LON")
    )
    pincode = (
        data.get("pincode")
        or os.getenv("QUICKCOMMERCE_DEFAULT_PINCODE")
        or None
    )

    if not query:
        return error("query is required", 400)

    if lat is None or lon is None:
        return error("lat and lon are required", 400)

    try:
        upstream = fetch_products(
            query,
            platform=platform,
            lat=lat,
            lon=lon,
            pincode=pincode
        )

        inserted = 0
        updated = 0
        skipped = 0

        raw_products = upstream.get("products") if isinstance(upstream, dict) else upstream
        raw_products = raw_products if isinstance(raw_products, list) else []

        transformed = []
        for raw in raw_products:
            product = transform_product(raw, query=query, platform=platform)
            if not product:
                skipped += 1
                continue
            transformed.append(product)

        ids = [p["id"] for p in transformed if p.get("id")]
        existing_products = {}
        if ids:
            existing_products = {p.id: p for p in Product.query.filter(Product.id.in_(ids)).all()}

        for item in transformed:
            product_id = item["id"]

            if product_id in existing_products:
                p = existing_products[product_id]
                p.name = item["name"]
                p.brand = item["brand"]
                p.image = item["image"]
                p.category = item["category"]
                p.price = item["price"]
                p.quantity = item["quantity"]
                p.in_stock = item["in_stock"]
                p.source = item.get("source", "quickcommerce")
                p.last_synced = item.get("last_synced")

                updated += 1
            else:
                new_product = Product(
                    id=product_id,
                    name=item["name"],
                    brand=item["brand"],
                    image=item["image"],
                    category=item["category"],
                    price=item["price"],
                    quantity=item["quantity"],
                    in_stock=item["in_stock"],
                    source=item.get("source", "quickcommerce"),
                    last_synced=item.get("last_synced")
                )

                db.session.add(new_product)
                inserted += 1

        db.session.commit()

        return jsonify({
            "query": query,
            "platform": platform,
            "fetched": len(raw_products),
            "inserted": inserted,
            "updated": updated,
            "skipped": skipped,
            "total": inserted + updated
        }), 200

    except QuickCommerceAPIError as exc:
        logger.exception("QuickCommerce sync failed: %s", exc)
        return error(str(exc) or "API error", exc.status_code or 502)

    except Exception as exc:
        logger.exception("Unexpected sync error: %s", exc)
        return error("sync failed (internal error)", 500)

