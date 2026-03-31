import logging
import os
import time
from datetime import datetime
from pathlib import Path

import requests
from sqlalchemy.dialects.mysql import insert as mysql_insert
from dotenv import dotenv_values

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


def _sanitize_key(value):
    if value is None:
        return ""
    s = str(value).strip()
    if not s:
        return ""
    s = s.strip("\"'").strip()
    if "#" in s:
        s = s.split("#", 1)[0].strip()
    return s


def _is_placeholder(value):
    v = (value or "").strip().lower()
    if not v:
        return True
    if "change-me" in v:
        return True
    if "..." in v:
        return True
    if "<" in v or ">" in v:
        return True
    if "your-api-key" in v or "your_api_key" in v:
        return True
    if v in {"sk_live", "sk_test", "sk_live_", "sk_test_"}:
        return True
    return False


def _read_env_value(env_path, key):
    try:
        values = dotenv_values(env_path)
    except Exception:
        return ""
    return _sanitize_key(values.get(key))


def _get_api_key():
    api_key = _sanitize_key(os.getenv("API_KEY"))
    if api_key and not _is_placeholder(api_key):
        return api_key

    # If env vars were overridden (e.g., multiple .env files), try reading from disk.
    try:
        root_env_path = Path(__file__).resolve().parents[3] / ".env"
        backend_env_path = Path(__file__).resolve().parents[2] / ".env"
    except Exception:
        root_env_path = None
        backend_env_path = None

    for env_path in (backend_env_path, root_env_path):
        if not env_path:
            continue
        if not env_path.exists():
            continue
        candidate = _read_env_value(env_path, "API_KEY")
        if candidate and not _is_placeholder(candidate):
            logger.warning("Loaded API_KEY from %s", env_path)
            return candidate

    fallback = _sanitize_key(os.getenv("API_KEY"))
    if fallback and not _is_placeholder(fallback) and fallback.lower().startswith("sk_"):
        logger.warning("API_KEY not set; falling back to API_KEY for upstream calls")
        return fallback

    raise QuickCommerceAPIError("missing API_KEY", status_code=500)


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

    api_key = _get_api_key()
    headers = {"X-API-Key": api_key, "User-Agent": "SpeeDial/1.0"}

    def _do_request(request_params, request_headers):
        res = requests.get(QCA_SEARCH_URL, params=request_params, headers=request_headers, timeout=timeout_s)
        try:
            payload = res.json()
        except ValueError:
            payload = None
        return res, payload

    for attempt in range(max_retries + 1):
        try:
            res, payload = _do_request(params, headers)

            # Some upstreams may not accept custom headers in certain environments.
            # QuickCommerce also supports passing the key via query parameter `api_key`.
            if res.status_code == 401:
                res, payload = _do_request({**params, "api_key": api_key}, {"User-Agent": "SpeeDial/1.0"})

            if not res.ok:
                message = None
                if isinstance(payload, dict):
                    message = payload.get("message") or payload.get("error")
                if res.status_code == 401:
                    message = message or "upstream unauthorized (401) — check API_KEY"
                    raise QuickCommerceAPIError(message, status_code=502)

                message = message or f"upstream error ({res.status_code})"
                raise QuickCommerceAPIError(message, status_code=502)

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
