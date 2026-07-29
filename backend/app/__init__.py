from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_mail import Mail
from config import Config
import os

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
mail = Mail()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)

    # Enable CORS
    CORS(app)

    # Create uploads folder if it doesn't exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Import models AFTER db.init_app() to avoid circular imports
    with app.app_context():
        from app.models import learning
        from app.models import job
        from app.models import user

        db.create_all()

    # Register Blueprints
    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    from app.routes.learning import learning_bp
    app.register_blueprint(learning_bp, url_prefix="/api/learning")

    from app.routes.job import job_bp
    app.register_blueprint(job_bp, url_prefix="/api/jobs")

    from app.routes.quiz import quiz_bp
    app.register_blueprint(quiz_bp, url_prefix='/api/quiz')

    return app