from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.engine import URL
from werkzeug.security import generate_password_hash, check_password_hash
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# --------------------
# Database Config
# --------------------
db_url = URL.create(
    drivername="mysql+pymysql",
    username=os.getenv("DB_USER", "root"),
    password=os.getenv("DB_PASS"),
    host=os.getenv("DB_HOST", "localhost"),
    database=os.getenv("DB_NAME", "food_app"),
    port=int(os.getenv("DB_PORT", 3306)),
)

app.config["SQLALCHEMY_DATABASE_URI"] = db_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# --------------------
# Model (TABLE)
# --------------------
class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    item = db.Column(db.String(50), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

# --------------------
# CREATE TABLES
# --------------------
with app.app_context():
    db.create_all()

# --------------------
# API
# --------------------
@app.route("/order", methods=["POST"])
def place_order():
    data = request.get_json()

    if not data or "item" not in data:
        return jsonify({"error": "Item is required"}), 400

    new_order = Order(item=data["item"], quantity=data.get("quantity", 1))

    db.session.add(new_order)
    db.session.commit()

    return jsonify({"message": "Order placed", "order_id": new_order.id}), 201


# --------------------
# AUTH / USERS
# --------------------
@app.route("/auth/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not name or not email or not password:
        return jsonify({"error": "name, email, password are required"}), 400

    if len(password) < 6:
        return jsonify({"error": "password must be at least 6 characters"}), 400

    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({"error": "email already registered"}), 409

    user = User(
        name=name,
        email=email,
        password_hash=generate_password_hash(password),
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "user created", "user_id": user.id}), 201


@app.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "invalid credentials"}), 401

    # For now we just return the user record (no JWT/session yet)
    return jsonify({
        "message": "login ok",
        "user_id": user.id,
        "name": user.name,
        "email": user.email,
    }), 200


@app.route("/users", methods=["GET"])
def list_users():
    users = User.query.order_by(User.id.desc()).limit(50).all()
    return jsonify([
        {"id": u.id, "name": u.name, "email": u.email} for u in users
    ])

# --------------------
# RUN SERVER
# --------------------
if __name__ == "__main__":
    app.run(port=8080, debug=True)
