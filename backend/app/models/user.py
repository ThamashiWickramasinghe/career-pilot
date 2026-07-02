from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('job_seeker', 'instructor', 'admin', 'company'),
                 nullable=False, default='job_seeker')

            # Company specific fields
    company_name = db.Column(db.String(200), nullable=True)
    company_description = db.Column(db.Text, nullable=True)
    company_website = db.Column(db.String(200), nullable=True)
    company_location = db.Column(db.String(200), nullable=True)
    current_post = db.Column(db.String(100), nullable=True)
    
    # Job seeker profile fields
    skills = db.Column(db.Text, nullable=True)
    education = db.Column(db.String(200), nullable=True)
    experience_years = db.Column(db.Integer, default=0)
    bio = db.Column(db.Text, nullable=True)
    
    # Password reset
    reset_token = db.Column(db.String(255), nullable=True)
    reset_token_expiry = db.Column(db.DateTime, nullable=True)
    
    # Account status
    is_active = db.Column(db.Boolean, default=True)
    is_approved = db.Column(db.Boolean, default=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,
                           onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'current_post': self.current_post,
            'skills': self.skills,
            'education': self.education,
            'experience_years': self.experience_years,
            'bio': self.bio,
            'company_name': self.company_name,
            'company_description': self.company_description,
            'company_website': self.company_website,
            'company_location': self.company_location,
            'is_active': self.is_active,
            'created_at': str(self.created_at)
        }