import logging
import os
import time
from datetime import datetime

import requests
from sqlalchemy.dialects.mysql import insert as mysql_insert

from ..extensions import db
from ..models import Product

logger = logging.getLogger(__name__)

QCA_BASE_URL = (os.getenv("QUICKCOMMERCE_API_BASE_URL") or "https://api.quickcommerceapi.com").rstrip(
    "/"
)
QCA_SEARCH_URL = f"{QCA_BASE_URL}/v1/search"

DEFAULT_TIMEOUT_S = 12
DEFAULT_MAX_RETRIES = 2


class QuickCommerceAPIError(Exception):
    def __init__(self, message, status_code=None):
        super().__init__(message)
        self.status_code = status_code


def _get_api_key():
    api_key = (os.getenv("QUICKCOMMERCE_API_KEY") or "").strip()
    if api_key:
        return api_key

    fallback = (os.getenv("API_KEY") or "").strip()
    if fallback:
        logger.warning("QUICKCOMMERCE_API_KEY not set; falling back to API_KEY for upstream calls")
        return fallback

    raise QuickCommerceAPIError("missing QUICKCOMMERCE_API_KEY", status_code=500)


def _to_int(value, default=0):
    try:
        if value is None:
            return default
        return int(round(float(value)))
    except (TypeError, ValueError):
        return default


def fetch_products(
    query,
    *,
    platform,
    lat,
    lon,
    pincode=None,
    timeout_s=DEFAULT_TIMEOUT_S,
    max_retries=DEFAULT_MAX_RETRIES,
):
    params = {"q": query, "platform": platform, "lat": lat, "lon": lon}
    if pincode:
        params["pincode"] = pincode

    headers = {"X-API-Key": _get_api_key(), "User-Agent": "SpeeDial/1.0"}

    for attempt in range(max_retries + 1):
        try:
            res = requests.get(QCA_SEARCH_URL, params=params, headers=headers, timeout=timeout_s)
            try:
                payload = res.json()
            except ValueError:
                payload = None

            if not res.ok:
                message = None
                if isinstance(payload, dict):
                    message = payload.get("message") or payload.get("error")
                message = message or f"upstream error ({res.status_code})"
                raise QuickCommerceAPIError(message, status_code=res.status_code)

            if not isinstance(payload, dict):
                raise QuickCommerceAPIError("invalid upstream response", status_code=502)

            if payload.get("status") and payload.get("status") != "success":
                message = payload.get("message") or payload.get("error") or "upstream error"
                raise QuickCommerceAPIError(message, status_code=502)

            data = payload.get("data") or {}
            products = data.get("products") or []

            return {
                "request_id": payload.get("request_id") or payload.get("requestId"),
                "credits_remaining": payload.get("credits_remaining"),
                "total_results": data.get("total_results"),
                "products": products if isinstance(products, list) else [],
            }
        except QuickCommerceAPIError:
            raise
        except (requests.RequestException, ValueError) as exc:
            logger.exception(
                "QuickCommerce search failed (query=%s platform=%s attempt=%s): %s",
                query,
                platform,
                attempt + 1,
                exc,
            )
            if attempt >= max_retries:
                raise QuickCommerceAPIError("upstream request failed", status_code=502)
            time.sleep(0.5 * (2**attempt))


def transform_product(raw, *, query, platform):
    if not isinstance(raw, dict):
        return None

    item_id = str(raw.get("id") or "").strip()
    name = (raw.get("name") or "").strip()

    images = raw.get("images") or []
    image = ""
    if isinstance(images, list) and len(images) > 0:
        image = str(images[0] or "").strip()

    if not item_id or not name or not image:
        return None

    brand = (raw.get("brand") or "").strip()
    category = (query or "").strip().lower()

    price = raw.get("offer_price")
    if price is None:
        price = raw.get("price")
    if price is None:
        price = raw.get("mrp")

    available = raw.get("available")
    in_stock = available if isinstance(available, bool) else True
    inventory = raw.get("inventory")

    return {
        "id": f"{platform}:{item_id}",
        "name": name,
        "brand": brand,
        "image": image,
        "category": category,
        "price": _to_int(price, default=0),
        "in_stock": in_stock,
        "quantity": _to_int(inventory, default=0),
        "source": f"quickcommerceapi:{platform}",
        "last_synced": datetime.utcnow(),
    }


def save_products(products):
    if not products:
        return 0

    stmt = mysql_insert(Product).values(products)
    update_columns = {
        "name": stmt.inserted.name,
        "brand": stmt.inserted.brand,
        "image": stmt.inserted.image,
        "category": stmt.inserted.category,
        "price": stmt.inserted.price,
        "in_stock": stmt.inserted.in_stock,
        "quantity": stmt.inserted.quantity,
        "source": stmt.inserted.source,
        "last_synced": stmt.inserted.last_synced,
    }
    stmt = stmt.on_duplicate_key_update(**update_columns)

    db.session.execute(stmt)
    db.session.commit()
    return len(products)


def sync_quickcommerce(query, *, platform, lat, lon, pincode=None, delay_s=0.15):
    fetched = 0
    saved = 0
    skipped = 0

    upstream = fetch_products(
        query,
        platform=platform,
        lat=lat,
        lon=lon,
        pincode=pincode,
    )

    raw_products = upstream.get("products") or []
    fetched = len(raw_products)

    transformed = []
    for raw in raw_products:
        product = transform_product(raw, query=query, platform=platform)
        if not product:
            skipped += 1
            continue
        transformed.append(product)

    saved = save_products(transformed)

    if delay_s:
        time.sleep(delay_s)

    logger.info(
        "QuickCommerce sync finished (query=%s platform=%s fetched=%s saved=%s skipped=%s)",
        query,
        platform,
        fetched,
        saved,
        skipped,
    )

    return {
        "message": "sync complete",
        "query": query,
        "platform": platform,
        "lat": lat,
        "lon": lon,
        "pincode": pincode,
        "requestId": upstream.get("request_id"),
        "creditsRemaining": upstream.get("credits_remaining"),
        "totalResults": upstream.get("total_results"),
        "fetched": fetched,
        "saved": saved,
        "skipped": skipped,
    }
