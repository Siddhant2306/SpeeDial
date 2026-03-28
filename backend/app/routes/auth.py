from flask import Blueprint, jsonify
from werkzeug.security import check_password_hash, generate_password_hash

from ..extensions import db
from ..models import User
from ..utils import error, get_json

bp = Blueprint("auth", __name__)


@bp.route("/auth/register", methods=["POST"])
def register():
    data = get_json()

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not name or not email or not password:
        return error("name, email, password are required", 400)

    if len(password) < 6:
        return error("password must be at least 6 characters", 400)

    existing = User.query.filter_by(email=email).first()
    if existing:
        return error("email already registered", 409)

    user = User(
        name=name,
        email=email,
        password_hash=generate_password_hash(password),
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "user created", "user_id": user.id}), 201


@bp.route("/auth/login", methods=["POST"])
def login():
    data = get_json()

    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return error("email and password are required", 400)

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return error("invalid credentials", 401)

    return (
        jsonify(
            {
                "message": "login ok",
                "user_id": user.id,
                "name": user.name,
                "email": user.email,
            }
        ),
        200,
    )


@bp.route("/users", methods=["GET"])
def list_users():
    users = User.query.order_by(User.id.desc()).limit(50).all()
    return jsonify([{"id": u.id, "name": u.name, "email": u.email} for u in users])

