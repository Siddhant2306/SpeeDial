from flask import Blueprint, jsonify, request

from ..extensions import db
from ..models import Order
from ..utils import error, get_json, parse_int

bp = Blueprint("orders", __name__)


@bp.route("/order", methods=["POST"])
def place_order():
    data = get_json()

    user_id = data.get("user_id")
    if not user_id:
        return error("user_id is required", 400)

    if "item" not in data:
        return error("Item is required", 400)

    qty = parse_int(data.get("quantity", 1))
    if qty is None:
        return error("quantity must be a number", 400)
    if qty < 1:
        return error("quantity must be >= 1", 400)

    new_order = Order(
        item=data["item"],
        quantity=qty,
        user_id=user_id   
    )

    db.session.add(new_order)
    db.session.commit()

    return jsonify({
        "message": "Order placed",
        "order_id": new_order.id
    }), 201

@bp.route("/orders/bulk", methods=["POST"])
def place_bulk_orders():
    """
    Accepts:
    {
      "user_id": 1,
      "items": [
        { "item": "snack", "quantity": 2 }
      ]
    }
    """

    data = get_json()

    user_id = data.get("user_id")
    if not user_id:
        return error("user_id is required", 400)

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

        order = Order(
            item=name,
            quantity=qty,
            user_id=user_id 
        )

        db.session.add(order)
        db.session.flush()
        created_ids.append(order.id)

    db.session.commit()

    return jsonify({
        "message": "orders placed",
        "order_ids": created_ids
    }), 201


@bp.route("/orders", methods=["GET"])
def get_orders():
    user_id = request.args.get("user_id")

    if not user_id:
        return error("user_id is required", 400)

    try:
        user_id = int(user_id)
    except:
        return error("user_id must be an integer", 400)

    orders = Order.query.filter_by(user_id=user_id).all()

    return jsonify([o.to_dict() for o in orders])