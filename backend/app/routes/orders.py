from flask import Blueprint, jsonify

from ..extensions import db
from ..models import Order
from ..utils import error, get_json, parse_int

bp = Blueprint("orders", __name__)


@bp.route("/order", methods=["POST"])
def place_order():
    data = get_json()

    if "item" not in data:
        return error("Item is required", 400)

    qty = parse_int(data.get("quantity", 1))
    if qty is None:
        return error("quantity must be a number", 400)
    if qty < 1:
        return error("quantity must be >= 1", 400)

    new_order = Order(item=data["item"], quantity=qty)
    db.session.add(new_order)
    db.session.commit()

    return jsonify({"message": "Order placed", "order_id": new_order.id}), 201


@bp.route("/orders/bulk", methods=["POST"])
def place_bulk_orders():
    """Accepts: { items: [ {item: "snack", quantity: 2}, ... ] } and creates 1 row per item."""
    data = get_json()
    items = data.get("items") or []

    if not isinstance(items, list) or len(items) == 0:
        return error("items must be a non-empty list", 400)

    created_ids = []
    for it in items:
        if not isinstance(it, dict):
            return error("each item must be an object", 400)

        name = it.get("item")
        qty = parse_int(it.get("quantity", 1))

        if not name:
            return error("item is required", 400)
        if qty is None:
            return error("quantity must be a number", 400)
        if qty < 1:
            return error("quantity must be >= 1", 400)

        order = Order(item=name, quantity=qty)
        db.session.add(order)
        db.session.flush()
        created_ids.append(order.id)

    db.session.commit()
    return jsonify({"message": "orders placed", "order_ids": created_ids}), 201

