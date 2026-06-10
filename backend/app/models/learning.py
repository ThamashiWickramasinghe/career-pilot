from app import db
from datetime import datetime

class LearningContent(db.Model):
    __tablename__ = 'learning_content'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(100), nullable=True)
    content_type = db.Column(
        db.Enum('video_link', 'pdf', 'note'),
        nullable=False, default='video_link'
    )
    # For video — Google Drive link
    drive_link = db.Column(db.String(500), nullable=True)
    # Thumbnail image URL or path
    thumbnail = db.Column(db.String(500), nullable=True)
    # For PDF/notes — file path
    file_path = db.Column(db.String(500), nullable=True)

    # Instructor who uploaded
    instructor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    instructor = db.relationship('User', foreign_keys=[instructor_id])

    # Admin approval
    is_approved = db.Column(db.Boolean, default=False)
    approved_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    approved_at = db.Column(db.DateTime, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'content_type': self.content_type,
            'drive_link': self.drive_link,
            'thumbnail': self.thumbnail,
            'file_path': self.file_path,
            'instructor_id': self.instructor_id,
            'instructor_name': self.instructor.full_name if self.instructor else None,
            'is_approved': self.is_approved,
            'created_at': str(self.created_at)
        }


class ContentAccess(db.Model):
    __tablename__ = 'content_access'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content_id = db.Column(db.Integer, db.ForeignKey('learning_content.id'), nullable=False)
    granted_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)
    is_active = db.Column(db.Boolean, default=True)

    user = db.relationship('User', foreign_keys=[user_id])
    content = db.relationship('LearningContent', foreign_keys=[content_id])

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'content_id': self.content_id,
            'granted_at': str(self.granted_at),
            'expires_at': str(self.expires_at),
            'is_active': self.is_active
        }


class ReAccessRequest(db.Model):
    __tablename__ = 'reaccess_requests'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content_id = db.Column(db.Integer, db.ForeignKey('learning_content.id'), nullable=False)
    message = db.Column(db.Text, nullable=True)
    status = db.Column(
        db.Enum('pending', 'approved', 'denied'),
        default='pending'
    )
    requested_at = db.Column(db.DateTime, default=datetime.utcnow)
    responded_at = db.Column(db.DateTime, nullable=True)

    user = db.relationship('User', foreign_keys=[user_id])
    content = db.relationship('LearningContent', foreign_keys=[content_id])

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_name': self.user.full_name if self.user else None,
            'content_id': self.content_id,
            'content_title': self.content.title if self.content else None,
            'message': self.message,
            'status': self.status,
            'requested_at': str(self.requested_at),
            'responded_at': str(self.responded_at) if self.responded_at else None
        }


class ContentComment(db.Model):
    __tablename__ = 'content_comments'

    id = db.Column(db.Integer, primary_key=True)
    content_id = db.Column(db.Integer, db.ForeignKey('learning_content.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    comment = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', foreign_keys=[user_id])
    content = db.relationship('LearningContent', foreign_keys=[content_id])

    def to_dict(self):
        return {
            'id': self.id,
            'content_id': self.content_id,
            'user_id': self.user_id,
            'user_name': self.user.full_name if self.user else None,
            'comment': self.comment,
            'created_at': str(self.created_at)
        }