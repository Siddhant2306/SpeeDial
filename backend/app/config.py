import os
from sqlalchemy.engine import URL


def build_database_url():
    return URL.create(
        drivername=os.getenv("DB_DRIVER", "mysql+pymysql"),
        username=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASS"),
        host=os.getenv("DB_HOST", "localhost"),
        database=os.getenv("DB_NAME", "food_app"),
        port=int(os.getenv("DB_PORT", 3306)),
    )


def configure_app(app):
    app.config["SQLALCHEMY_DATABASE_URI"] = build_database_url()
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

