from app import create_app, db
from app.models.user import User
import bcrypt

app = create_app()

with app.app_context():
    # Create admin user
    if not User.query.filter_by(email='admin@careerpilot.com').first():
        h = bcrypt.hashpw('admin'.encode(), bcrypt.gensalt()).decode()
        admin = User(
            full_name='Admin User',
            username='admin',
            email='admin@gmail.com',
            password=h,
            role='admin',
            current_post='Administrator'
        )
        db.session.add(admin)
        db.session.commit()
        print('Admin created!')
    else:
        print('Admin already exists!')

    print('Seed complete!')