from app import db
from datetime import datetime
import json

class ChallengeSession(db.Model):
    __tablename__ = 'challenge_sessions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', foreign_keys=[user_id])

    category = db.Column(db.String(100), nullable=False)
    difficulty = db.Column(db.Enum('Beginner', 'Intermediate', 'Advanced'), nullable=False)
    challenge_type = db.Column(db.Enum('quiz', 'coding', 'scenario'), nullable=False)
    challenge_title = db.Column(db.String(200), nullable=False)
    challenge_content = db.Column(db.Text, nullable=False)

    user_answer = db.Column(db.Text, nullable=True)
    ai_feedback = db.Column(db.Text, nullable=True)
    score = db.Column(db.Integer, default=0)
    max_score = db.Column(db.Integer, default=100)
    time_taken = db.Column(db.Integer, default=0)
    time_limit = db.Column(db.Integer, default=300)

    status = db.Column(
        db.Enum('in_progress', 'completed', 'timed_out'),
        default='in_progress'
    )
    badge_earned = db.Column(db.String(100), nullable=True)
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'category': self.category,
            'difficulty': self.difficulty,
            'challenge_type': self.challenge_type,
            'challenge_title': self.challenge_title,
            'challenge_content': self.challenge_content,
            'user_answer': self.user_answer,
            'ai_feedback': self.ai_feedback,
            'score': self.score,
            'max_score': self.max_score,
            'time_taken': self.time_taken,
            'time_limit': self.time_limit,
            'status': self.status,
            'badge_earned': self.badge_earned,
            'started_at': str(self.started_at),
            'completed_at': str(self.completed_at) if self.completed_at else None
        }


class UserBadge(db.Model):
    __tablename__ = 'user_badges'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    badge_name = db.Column(db.String(100), nullable=False)
    badge_icon = db.Column(db.String(10), nullable=True)
    badge_description = db.Column(db.String(200), nullable=True)
    category = db.Column(db.String(100), nullable=True)
    difficulty = db.Column(db.String(50), nullable=True)
    earned_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'badge_name': self.badge_name,
            'badge_icon': self.badge_icon,
            'badge_description': self.badge_description,
            'category': self.category,
            'difficulty': self.difficulty,
            'earned_at': str(self.earned_at)
        }