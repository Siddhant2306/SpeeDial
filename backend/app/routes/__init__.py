from .auth import bp as auth_bp
from .orders import bp as orders_bp


def register_routes(app):
    app.register_blueprint(orders_bp)
    app.register_blueprint(auth_bp)

