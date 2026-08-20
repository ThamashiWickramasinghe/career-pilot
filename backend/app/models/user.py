from app import db
from datetime import datetime
 
class User(db.Model):
    __tablename__ = 'users'
 
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(150), nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(
        db.Enum('job_seeker', 'instructor', 'admin', 'company'),
        nullable=False, default='job_seeker'
    )
    current_post = db.Column(db.String(150), nullable=True)
    skills = db.Column(db.Text, nullable=True)
    bio = db.Column(db.Text, nullable=True)
    experience_years = db.Column(db.Integer, default=0)
    github = db.Column(db.String(200), nullable=True)
    linkedin = db.Column(db.String(200), nullable=True)
    portfolio = db.Column(db.String(200), nullable=True)
 
    # Company fields
    company_name = db.Column(db.String(200), nullable=True)
    company_description = db.Column(db.Text, nullable=True)
    company_website = db.Column(db.String(200), nullable=True)
    company_location = db.Column(db.String(200), nullable=True)
 
    # Account status
    is_active = db.Column(db.Boolean, nullable=False, default=True)
 
    # Reset password
    reset_token = db.Column(db.String(255), nullable=True)
    reset_token_expiry = db.Column(db.DateTime, nullable=True)
 
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
 
    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'current_post': self.current_post,
            'skills': self.skills,
            'bio': self.bio,
            'experience_years': self.experience_years,
            'github': self.github,
            'linkedin': self.linkedin,
            'portfolio': self.portfolio,
            'company_name': self.company_name,
            'company_description': self.company_description,
            'company_website': self.company_website,
            'company_location': self.company_location,
            'is_active': self.is_active,
            'created_at': str(self.created_at)
        }
 