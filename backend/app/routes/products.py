import logging
import os

from flask import Blueprint, jsonify, request
from sqlalchemy import func

from ..models import Product
from ..services.quickcommerceapi import QuickCommerceAPIError, sync_quickcommerce
from ..utils import error, get_json, parse_float, require_api_key

logger = logging.getLogger(__name__)

bp = Blueprint("products", __name__)


@bp.route("/api/products", methods=["GET"], strict_slashes=False)
@require_api_key
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
            func.lower(Product.name).like(like) | func.lower(Product.brand).like(like)
        )

    if category:
        q = q.filter(func.lower(Product.category) == category.lower())

    products = q.order_by(Product.last_synced.desc()).limit(200).all()
    return jsonify([p.to_dict() for p in products])


@bp.route("/api/sync/quickcommerce", methods=["GET", "POST"], strict_slashes=False)
@require_api_key
def sync_products_from_quickcommerce():
    if request.method == "GET":
        return (
            jsonify(
                {
                    "message": "Use POST with JSON body to sync from QuickCommerce API.",
                    "example": {
                        "url": "/api/sync/quickcommerce",
                        "headers": {"X-API-Key": "YOUR_KEY"},
                        "body": {
                            "query": "milk",
                            "platform": "BlinkIt",
                            "lat": 12.9021,
                            "lon": 77.6639,
                        },
                    },
                }
            ),
            200,
        )

    data = get_json()

    query = (data.get("query") or data.get("q") or request.args.get("query") or "").strip()
    platform = (
        (data.get("platform") or request.args.get("platform") or os.getenv("QUICKCOMMERCE_DEFAULT_PLATFORM") or "BlinkIt")
        .strip()
    )
    lat = parse_float(data.get("lat") or request.args.get("lat") or os.getenv("QUICKCOMMERCE_DEFAULT_LAT"))
    lon = parse_float(data.get("lon") or request.args.get("lon") or os.getenv("QUICKCOMMERCE_DEFAULT_LON"))
    pincode = (
        (data.get("pincode") or request.args.get("pincode") or os.getenv("QUICKCOMMERCE_DEFAULT_PINCODE") or "")
        .strip()
        or None
    )

    if not query:
        return error("query is required", 400)
    if lat is None or lon is None:
        return error("lat and lon are required", 400)
    if not platform:
        return error("platform is required", 400)

    try:
        result = sync_quickcommerce(
            query,
            platform=platform,
            lat=lat,
            lon=lon,
            pincode=pincode,
        )
        return jsonify(result), 200
    except QuickCommerceAPIError as exc:
        logger.exception("QuickCommerce sync failed: %s", exc)
        status = exc.status_code or 502
        message = str(exc) or "sync failed (upstream API error)"
        return error(message, status)
    except Exception as exc:
        logger.exception("QuickCommerce sync failed: %s", exc)
        return error("sync failed (upstream API error)", 502)
