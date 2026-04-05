from flask import Blueprint, jsonify
from werkzeug.security import check_password_hash, generate_password_hash

from ..extensions import db
from ..models import Admin
from ..utils import error, get_json

bp = Blueprint("adminAuth", __name__)

@bp.route("/admin/auth/register", methods=["POST"])
def admin_register():
    data = get_json()

    email = (data.get("email") or "").strip().lower()
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""

    if not email or not username or not password:
        return error("email, username, password are required", 400)

    if len(password) < 6:
        return error("password must be at least 6 characters", 400)

    existing = Admin.query.filter_by(email=email).first()
    if existing:
        return error("email already registered", 409)

    admin = Admin(
        email=email,
        username=username,
        password_hash=generate_password_hash(password),
    )
    db.session.add(admin)
    db.session.commit()

    return jsonify({"message": "admin created", "admin_id": admin.id}), 201

@bp.route("/admin/auth/validate", methods=["POST"])
def admin_validate():
    data = get_json()

    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return error("email and password are required", 400)

    admin = Admin.query.filter_by(email=email).first()
    if not admin or not check_password_hash(admin.password_hash, password):
        return error("invalid credentials", 401)

    return (
        jsonify(
            {
                "message": "login ok",
                "admin_id": admin.id,
                "username": admin.username,
                "email": admin.email,
            }
        ),
        200,
    )