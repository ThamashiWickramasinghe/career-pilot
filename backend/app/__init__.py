from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_mail import Mail
from config import Config

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

    # Fix CORS
    CORS(app)

    # Create upload folder
    import os
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Register blueprints
    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    from app.routes.learning import learning_bp
    app.register_blueprint(learning_bp, url_prefix='/api/learning')

    from app.routes.job import job_bp
    app.register_blueprint(job_bp, url_prefix='/api/jobs')

    from app.routes.quiz import quiz_bp
    app.register_blueprint(quiz_bp, url_prefix='/api/quiz')

    from app.routes.ai_core import ai_bp, load_models
    app.register_blueprint(ai_bp, url_prefix='/api/ai')

    # Load AI models after app context is ready
    with app.app_context():
        load_models()

    return app