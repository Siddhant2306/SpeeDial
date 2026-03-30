import os
from functools import wraps

from flask import jsonify, request


def get_json():
    return request.get_json(silent=True) or {}


def error(message, status=400):
    return jsonify({"error": message}), status


def parse_int(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def parse_float(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def get_request_api_key():
    return request.headers.get("X-API-Key")


def require_api_key(handler):
    @wraps(handler)
    def wrapper(*args, **kwargs):
        expected = (os.getenv("API_KEY") or "").strip()
        if not expected:
            return handler(*args, **kwargs)

        provided = (get_request_api_key() or "").strip()
        if provided != expected:
            return error("unauthorized", 401)

        return handler(*args, **kwargs)

    return wrapper

