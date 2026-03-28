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

