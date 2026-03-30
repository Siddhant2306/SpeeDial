from pathlib import Path
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

from .config import configure_app
from .extensions import db
from .routes import register_routes


def create_app():
    root_env_path = Path(__file__).resolve().parents[2] / ".env"
    env_path = Path(__file__).resolve().parents[1] / ".env"
    load_dotenv(root_env_path)
    load_dotenv(env_path, override=True)

    app = Flask(__name__)
    CORS(app)

    configure_app(app)
    db.init_app(app)

    with app.app_context():
        from . import models

        db.create_all()

    register_routes(app)
    return app
