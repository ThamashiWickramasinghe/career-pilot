from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.quiz import QuizCategory, QuizQuestion, QuizAttempt
import json
import random
from datetime import datetime

quiz_bp = Blueprint('quiz', __name__)


def get_user_from_token():
    try:
        from flask_jwt_extended import get_jwt
        identity = get_jwt_identity()
        claims = get_jwt()
        user_id = claims.get('id') or identity
        user_role = claims.get('role')
        return int(user_id), user_role
    except Exception as e:
        return None, None


# ── GET ALL CATEGORIES ────────────────────────────────
@quiz_bp.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():
    categories = QuizCategory.query.filter_by(is_active=True).all()
    return jsonify({'categories': [c.to_dict() for c in categories]}), 200


# ── GET QUIZ QUESTIONS (randomized, no answers) ───────
@quiz_bp.route('/questions/<string:category_code>', methods=['GET'])
@jwt_required()
def get_questions(category_code):
    category = QuizCategory.query.filter_by(code=category_code).first()
    if not category:
        return jsonify({'message': 'Category not found'}), 404

    questions = QuizQuestion.query.filter_by(
        category_id=category.id,
        is_active=True
    ).all()

    # Randomize question order (anti-cheat)
    random.shuffle(questions)

    # Randomize options order per question (anti-cheat)
    result = []
    for q in questions:
        options = [q.option_a, q.option_b, q.option_c, q.option_d]
        correct_text = options[q.correct_option]

        # Shuffle options
        random.shuffle(options)

        # Find new position of correct answer
        new_correct = options.index(correct_text)

        result.append({
            'id': q.id,
            'question_code': q.question_code,
            'question_text': q.question_text,
            'options': options,
            'correct_option': new_correct,  # shuffled position
            'marks': q.marks
        })

    return jsonify({
        'category': category.to_dict(),
        'questions': result
    }), 200


# ── START QUIZ ATTEMPT ────────────────────────────────
@quiz_bp.route('/start', methods=['POST'])
@jwt_required()
def start_quiz():
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    # Check if there's an existing in_progress attempt
    existing = QuizAttempt.query.filter_by(
        user_id=user_id,
        status='in_progress'
    ).first()

    if existing:
        # Abandon old attempt
        existing.status = 'abandoned'
        db.session.commit()

    attempt = QuizAttempt(
        user_id=user_id,
        category_scores='{}',
        skipped_categories='[]',
        status='in_progress'
    )

    db.session.add(attempt)
    db.session.commit()

    return jsonify({
        'message': 'Quiz started',
        'attempt_id': attempt.id
    }), 201


# ── SUBMIT CATEGORY ANSWERS ───────────────────────────
@quiz_bp.route('/submit-category', methods=['POST'])
@jwt_required()
def submit_category():
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    data = request.get_json()
    attempt_id = data.get('attempt_id')
    category_code = data.get('category_code')
    answers = data.get('answers', {})  # {question_id: selected_option}
    skipped = data.get('skipped', False)
    tab_switches = data.get('tab_switches', 0)

    attempt = QuizAttempt.query.get_or_404(attempt_id)

    if attempt.user_id != user_id:
        return jsonify({'message': 'Not authorized'}), 403

    category_scores = attempt.get_category_scores()
    skipped_categories = attempt.get_skipped_categories()

    if skipped:
        if category_code not in skipped_categories:
            skipped_categories.append(category_code)
        category_scores[category_code] = 0
    else:
        # Calculate score for this category
        score = 0
        category = QuizCategory.query.filter_by(code=category_code).first()

        for question_id, selected_option in answers.items():
            question = QuizQuestion.query.get(int(question_id))
            if question and question.correct_option == selected_option:
                score += question.marks

        # Store as percentage (0-100)
        max_score = 100  # 10 questions x 10 marks
        category_scores[category_code] = score

    attempt.category_scores = json.dumps(category_scores)
    attempt.skipped_categories = json.dumps(skipped_categories)
    attempt.tab_switches += tab_switches

    db.session.commit()

    return jsonify({
        'message': 'Category submitted',
        'category_score': category_scores.get(category_code, 0)
    }), 200


# ── COMPLETE QUIZ ─────────────────────────────────────
@quiz_bp.route('/complete', methods=['POST'])
@jwt_required()
def complete_quiz():
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    data = request.get_json()
    attempt_id = data.get('attempt_id')
    time_taken = data.get('time_taken_seconds', 0)

    attempt = QuizAttempt.query.get_or_404(attempt_id)

    if attempt.user_id != user_id:
        return jsonify({'message': 'Not authorized'}), 403

    category_scores = attempt.get_category_scores()

    # Calculate total score
    if category_scores:
        total = sum(category_scores.values()) / (len(category_scores) * 100) * 100
    else:
        total = 0

    attempt.total_score = total
    attempt.time_taken_seconds = time_taken
    attempt.status = 'completed'
    attempt.completed_at = datetime.utcnow()

    db.session.commit()

    return jsonify({
        'message': 'Quiz completed',
        'attempt': attempt.to_dict()
    }), 200


# ── GET USER'S LATEST ATTEMPT ─────────────────────────
@quiz_bp.route('/my-result', methods=['GET'])
@jwt_required()
def get_my_result():
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    attempt = QuizAttempt.query.filter_by(
        user_id=user_id,
        status='completed'
    ).order_by(QuizAttempt.completed_at.desc()).first()

    if not attempt:
        return jsonify({'message': 'No completed quiz found'}), 404

    return jsonify({'attempt': attempt.to_dict()}), 200


# ── LOG ANTI-CHEAT EVENT ──────────────────────────────
@quiz_bp.route('/log-anticheat', methods=['POST'])
@jwt_required()
def log_anticheat():
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    data = request.get_json()
    attempt_id = data.get('attempt_id')
    event_type = data.get('event_type')  # 'tab_switch', 'copy_attempt'

    attempt = QuizAttempt.query.get_or_404(attempt_id)

    if event_type == 'tab_switch':
        attempt.tab_switches += 1

    db.session.commit()

    return jsonify({'message': 'Event logged'}), 200


# ── ADMIN: ADD QUESTION ───────────────────────────────
@quiz_bp.route('/admin/questions', methods=['POST'])
@jwt_required()
def add_question():
    user_id, user_role = get_user_from_token()
    if user_role != 'admin':
        return jsonify({'message': 'Admins only'}), 403

    data = request.get_json()
    category = QuizCategory.query.filter_by(
        code=data['category_code']
    ).first()

    if not category:
        return jsonify({'message': 'Category not found'}), 404

    question = QuizQuestion(
        category_id=category.id,
        question_code=data['question_code'],
        question_text=data['question_text'],
        option_a=data['option_a'],
        option_b=data['option_b'],
        option_c=data['option_c'],
        option_d=data['option_d'],
        correct_option=data['correct_option'],
        marks=data.get('marks', 10)
    )

    db.session.add(question)
    db.session.commit()

    return jsonify({
        'message': 'Question added',
        'question': question.to_dict(include_answer=True)
    }), 201


# ── ADMIN: GET ALL QUESTIONS ──────────────────────────
@quiz_bp.route('/admin/questions', methods=['GET'])
@jwt_required()
def get_all_questions():
    user_id, user_role = get_user_from_token()
    if user_role != 'admin':
        return jsonify({'message': 'Admins only'}), 403

    category_code = request.args.get('category')
    if category_code:
        category = QuizCategory.query.filter_by(code=category_code).first()
        questions = QuizQuestion.query.filter_by(category_id=category.id).all()
    else:
        questions = QuizQuestion.query.all()

    return jsonify({
        'questions': [q.to_dict(include_answer=True) for q in questions]
    }), 200