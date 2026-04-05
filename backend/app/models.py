from .extensions import db
from datetime import datetime


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


class Admin(db.Model):
    __tablename__ = "admin"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.String(32), primary_key=True)
    name = db.Column(db.String(255), nullable=False, index=True)
    brand = db.Column(db.String(255), nullable=False, default="")
    image = db.Column(db.String(1024), nullable=False, default="")
    category = db.Column(db.String(255), nullable=False, default="", index=True)
    price = db.Column(db.Integer, nullable=False)
    in_stock = db.Column(db.Boolean, nullable=False, default=True)
    quantity = db.Column(db.Integer, nullable=False, default=0)
    source = db.Column(db.String(50), nullable=False, default="quickcommerceapi")
    last_synced = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, index=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "brand": self.brand,
            "image": self.image,
            "category": self.category,
            "price": self.price,
            "inStock": self.in_stock,
            "quantity": self.quantity,
            "source": self.source,
            "lastSynced": self.last_synced.isoformat() if self.last_synced else None,
        }
