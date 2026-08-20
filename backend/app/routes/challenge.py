from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models.challenge import ChallengeSession, UserBadge
from datetime import datetime

challenge_bp = Blueprint('challenge', __name__)


def get_user_from_token():
    try:
        from flask_jwt_extended import get_jwt
        claims = get_jwt()
        return int(claims.get('id')), claims.get('role')
    except:
        return None, None


# ── SAVE CHALLENGE SESSION ─────────────────────────────
@challenge_bp.route('/save', methods=['POST'])
@jwt_required()
def save_challenge():
    user_id, _ = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    data = request.get_json()

    session = ChallengeSession(
        user_id=user_id,
        category=data.get('category'),
        difficulty=data.get('difficulty'),
        challenge_type=data.get('challenge_type'),
        challenge_title=data.get('challenge_title'),
        challenge_content=data.get('challenge_content'),
        user_answer=data.get('user_answer'),
        ai_feedback=data.get('ai_feedback'),
        score=data.get('score', 0),
        max_score=data.get('max_score', 100),
        time_taken=data.get('time_taken', 0),
        time_limit=data.get('time_limit', 300),
        status=data.get('status', 'completed'),
        badge_earned=data.get('badge_earned'),
        completed_at=datetime.utcnow()
    )

    db.session.add(session)

    # Award badge if earned
    badge_name = data.get('badge_earned')
    if badge_name:
        existing = UserBadge.query.filter_by(
            user_id=user_id,
            badge_name=badge_name
        ).first()
        if not existing:
            badge = UserBadge(
                user_id=user_id,
                badge_name=badge_name,
                badge_icon=data.get('badge_icon', ''),
                badge_description=data.get('badge_description', ''),
                category=data.get('category'),
                difficulty=data.get('difficulty')
            )
            db.session.add(badge)

    db.session.commit()
    return jsonify({
        'message': 'Challenge saved',
        'session': session.to_dict()
    }), 201


# ── GET MY CHALLENGE HISTORY ───────────────────────────
@challenge_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id, _ = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    sessions = ChallengeSession.query.filter_by(
        user_id=user_id,
        status='completed'
    ).order_by(ChallengeSession.completed_at.desc()).all()

    return jsonify({'sessions': [s.to_dict() for s in sessions]}), 200


# ── GET MY BADGES ──────────────────────────────────────
@challenge_bp.route('/badges', methods=['GET'])
@jwt_required()
def get_badges():
    user_id, _ = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    badges = UserBadge.query.filter_by(
        user_id=user_id
    ).order_by(UserBadge.earned_at.desc()).all()

    return jsonify({'badges': [b.to_dict() for b in badges]}), 200


# ── GET MY STATS ───────────────────────────────────────
@challenge_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    user_id, _ = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    sessions = ChallengeSession.query.filter_by(
        user_id=user_id,
        status='completed'
    ).all()

    badges = UserBadge.query.filter_by(user_id=user_id).count()

    total = len(sessions)
    avg_score = sum(s.score for s in sessions) / total if total > 0 else 0
    best_score = max((s.score for s in sessions), default=0)

    by_difficulty = {
        'Beginner': len([s for s in sessions if s.difficulty == 'Beginner']),
        'Intermediate': len([s for s in sessions if s.difficulty == 'Intermediate']),
        'Advanced': len([s for s in sessions if s.difficulty == 'Advanced']),
    }

    by_category = {}
    for s in sessions:
        by_category[s.category] = by_category.get(s.category, 0) + 1

    return jsonify({
        'total_challenges': total,
        'avg_score': round(avg_score, 1),
        'best_score': best_score,
        'total_badges': badges,
        'by_difficulty': by_difficulty,
        'by_category': by_category
    }), 200