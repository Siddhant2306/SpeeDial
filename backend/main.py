from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.engine import URL
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

    new_order = Order(
        item=data["item"],
        quantity=data.get("quantity", 1)
    )

    db.session.add(new_order)
    db.session.commit()

    return jsonify({
        "message": "Order placed",
        "order_id": new_order.id
    }), 201

# --------------------
# RUN SERVER
# --------------------
if __name__ == "__main__":
    app.run(port=8080, debug=True)
