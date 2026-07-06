from app import db
from datetime import datetime

class Job(db.Model):
    __tablename__ = 'jobs'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    company = db.relationship('User', foreign_keys=[company_id])
    category = db.Column(db.String(100), nullable=False)
    job_type = db.Column(
        db.Enum('Full Time', 'Part Time', 'Internship', 'Remote', 'Contract'),
        nullable=False
    )
    location = db.Column(db.String(200), nullable=False)
    salary_range = db.Column(db.String(100), nullable=True)
    required_skills = db.Column(db.Text, nullable=False)
    experience = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=False)
    deadline = db.Column(db.DateTime, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    applications = db.relationship('JobApplication', backref='job', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'company_id': self.company_id,
            'company_name': self.company.company_name or self.company.full_name,
            'category': self.category,
            'job_type': self.job_type,
            'location': self.location,
            'salary_range': self.salary_range,
            'required_skills': self.required_skills,
            'experience': self.experience,
            'description': self.description,
            'deadline': str(self.deadline) if self.deadline else None,
            'is_active': self.is_active,
            'applications_count': len(self.applications),
            'created_at': str(self.created_at)
        }


class JobApplication(db.Model):
    __tablename__ = 'job_applications'

    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    applicant_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    applicant = db.relationship('User', foreign_keys=[applicant_id])
    cover_letter = db.Column(db.Text, nullable=True)
    status = db.Column(
        db.Enum('Pending', 'Shortlisted', 'Hired', 'Rejected'),
        default='Pending'
    )
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,
                           onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'job_id': self.job_id,
            'job_title': self.job.title if self.job else None,
            'company_name': self.job.company.company_name or self.job.company.full_name if self.job else None,
            'applicant_id': self.applicant_id,
            'applicant_name': self.applicant.full_name if self.applicant else None,
            'applicant_email': self.applicant.email if self.applicant else None,
            'applicant_skills': self.applicant.skills if self.applicant else None,
            'cover_letter': self.cover_letter,
            'status': self.status,
            'applied_at': str(self.applied_at),
            'updated_at': str(self.updated_at)
        }