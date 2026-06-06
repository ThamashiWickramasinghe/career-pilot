from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('job_seeker', 'instructor', 'admin'), 
                     nullable=False, default='job_seeker')
    
    # Job seeker profile fields
    skills = db.Column(db.Text, nullable=True)
    education = db.Column(db.String(200), nullable=True)
    experience_years = db.Column(db.Integer, default=0)
    bio = db.Column(db.Text, nullable=True)
    
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
            'email': self.email,
            'role': self.role,
            'skills': self.skills,
            'education': self.education,
            'experience_years': self.experience_years,
            'bio': self.bio,
            'is_active': self.is_active,
            'created_at': str(self.created_at)
        }