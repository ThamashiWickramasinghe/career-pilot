from app import create_app, db

app = create_app()

from flask import send_from_directory
import os

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    upload_dir = os.path.join(os.getcwd(), 'uploads')
    return send_from_directory(upload_dir, filename)

if __name__ == '__main__':
    with app.app_context():
        from app.models.user import User
        from app.models.learning import LearningContent, ContentAccess, ReAccessRequest, ContentComment
        from app.models.job import Job, JobApplication
        from app.models.quiz import QuizCategory, QuizQuestion, QuizAttempt
        db.create_all()
        print("✅ Database tables created!")
    app.run(debug=True, port=5000)