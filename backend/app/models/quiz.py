from app import db
from datetime import datetime
import json

class QuizCategory(db.Model):
    __tablename__ = 'quiz_categories'

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(10), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    icon = db.Column(db.String(10), nullable=True)
    question_count = db.Column(db.Integer, default=10)
    is_active = db.Column(db.Boolean, default=True)

    questions = db.relationship('QuizQuestion', backref='category', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'code': self.code,
            'name': self.name,
            'description': self.description,
            'icon': self.icon,
            'question_count': self.question_count,
            'is_active': self.is_active
        }


class QuizQuestion(db.Model):
    __tablename__ = 'quiz_questions'

    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('quiz_categories.id'), nullable=False)
    question_code = db.Column(db.String(10), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    option_a = db.Column(db.String(300), nullable=False)
    option_b = db.Column(db.String(300), nullable=False)
    option_c = db.Column(db.String(300), nullable=False)
    option_d = db.Column(db.String(300), nullable=False)
    correct_option = db.Column(db.Integer, nullable=False)
    marks = db.Column(db.Integer, default=10)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self, include_answer=False):
        data = {
            'id': self.id,
            'category_id': self.category_id,
            'category_code': self.category.code if self.category else None,
            'question_code': self.question_code,
            'question_text': self.question_text,
            'options': [
                self.option_a,
                self.option_b,
                self.option_c,
                self.option_d
            ],
            'marks': self.marks,
        }
        if include_answer:
            data['correct_option'] = self.correct_option
        return data


class QuizAttempt(db.Model):
    __tablename__ = 'quiz_attempts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', foreign_keys=[user_id])

    # Scores per category stored as JSON
    # e.g. {"GI": 80, "PL": 60, "WD": 90, ...}
    category_scores = db.Column(db.Text, nullable=False, default='{}')

    # Skipped categories stored as JSON list
    # e.g. ["CC", "SRE"]
    skipped_categories = db.Column(db.Text, nullable=False, default='[]')

    # Total score
    total_score = db.Column(db.Float, default=0.0)

    # Predicted careers stored as JSON
    # e.g. [{"career": "Full Stack Developer", "confidence": 0.85}]
    predicted_careers = db.Column(db.Text, nullable=True)

    # Anti-cheat logs
    tab_switches = db.Column(db.Integer, default=0)
    time_taken_seconds = db.Column(db.Integer, default=0)

    status = db.Column(
        db.Enum('in_progress', 'completed', 'abandoned'),
        default='in_progress'
    )

    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)

    def get_category_scores(self):
        try:
            return json.loads(self.category_scores)
        except:
            return {}

    def get_skipped_categories(self):
        try:
            return json.loads(self.skipped_categories)
        except:
            return []

    def get_predicted_careers(self):
        try:
            return json.loads(self.predicted_careers) if self.predicted_careers else []
        except:
            return []

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'category_scores': self.get_category_scores(),
            'skipped_categories': self.get_skipped_categories(),
            'total_score': self.total_score,
            'predicted_careers': self.get_predicted_careers(),
            'tab_switches': self.tab_switches,
            'time_taken_seconds': self.time_taken_seconds,
            'status': self.status,
            'started_at': str(self.started_at),
            'completed_at': str(self.completed_at) if self.completed_at else None
        }