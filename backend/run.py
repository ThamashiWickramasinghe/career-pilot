from app import create_app, db

app = create_app()

from flask import send_from_directory
import os
from app.models.quiz import QuizCategory, QuizQuestion, QuizAttempt

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    upload_dir = os.path.join(os.getcwd(), 'uploads')
    return send_from_directory(upload_dir, filename)

if __name__ == '__main__':
    with app.app_context():
        # Import all models so tables are created
        from app.models.user import User
        from app.models.learning import LearningContent, ContentAccess, ReAccessRequest, ContentComment
        from app.models.job import Job, JobApplication
        db.create_all()
        print("✅ Database tables created!")
    app.run(debug=True, port=5000)