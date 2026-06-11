from app import create_app, db
import os

app = create_app()

# Serve uploaded files
from flask import send_from_directory

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    upload_dir = os.path.join(os.getcwd(), 'uploads')
    return send_from_directory(upload_dir, filename)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("✅ Database tables created!")
    app.run(debug=True, port=5000)