from .auth import bp as auth_bp
from .orders import bp as orders_bp
from .products import bp as products_bp
from .adminauth import bp as admin_auth_bp


def register_routes(app):
    app.register_blueprint(orders_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(admin_auth_bp)
