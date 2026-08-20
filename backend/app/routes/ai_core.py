from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models.quiz import QuizAttempt
from app.models.job import Job
from app.models.learning import LearningContent
import numpy as np
import json
import os
import pickle
import requests

ai_bp = Blueprint('ai', __name__)

# ── Gemini config (key stays server-side, loaded from .env) ─────
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
GEMINI_URL = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={GEMINI_API_KEY}'

# ── Load Models ───────────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../../ai_models/career_pilot_final_tuned_model.pkl')
ENCODER_PATH = os.path.join(os.path.dirname(__file__), '../../ai_models/label_encoder.pkl')

xgb_model = None
label_encoder = None

def load_models():
    global xgb_model, label_encoder
    try:
        with open(MODEL_PATH, 'rb') as f:
            xgb_model = pickle.load(f)
        with open(ENCODER_PATH, 'rb') as f:
            label_encoder = pickle.load(f)
        print("✅ AI models loaded successfully!")
    except Exception as e:
        print(f"⚠️ Warning: Could not load AI models: {e}")
        xgb_model = None
        label_encoder = None


def get_user_from_token():
    try:
        from flask_jwt_extended import get_jwt
        claims = get_jwt()
        return int(claims.get('id')), claims.get('role')
    except:
        return None, None


# ── NEW: Minimum-effort guard ─────────────────────────
# A quiz that was skipped entirely (or answered with nothing correct in
# every single category) should NEVER be handed to the model as if it were
# a legitimate, analyzable result. We block prediction in that case instead
# of letting XGBoost/rule-based fallback pick an arbitrary "best" class.
#
# MIN_NONZERO_CATEGORIES: at least this many categories must have a score
# above 0 for the attempt to be considered "real".
# MIN_TOTAL_SCORE: the sum of all category scores must exceed this.
MIN_NONZERO_CATEGORIES = 1
MIN_TOTAL_SCORE = 0  # sum of all category_scores.values() must be > this


def _quiz_is_valid(category_scores):
    """
    Returns (is_valid: bool, reason: str|None)
    is_valid=False means we should NOT run any prediction/recommendation.
    """
    if not category_scores or not isinstance(category_scores, dict):
        return False, "No quiz scores were submitted."

    values = list(category_scores.values())
    total_score = sum(v for v in values if isinstance(v, (int, float)))
    nonzero_categories = sum(1 for v in values if isinstance(v, (int, float)) and v > 0)

    if total_score <= MIN_TOTAL_SCORE:
        return False, "You scored 0 across every category — it looks like the quiz was skipped or left unanswered. Please complete the quiz to get an accurate career prediction."

    if nonzero_categories < MIN_NONZERO_CATEGORIES:
        return False, "Not enough quiz data was recorded to generate a reliable prediction. Please complete the quiz."

    return True, None


def _insufficient_data_response(reason):
    """Consistent response shape returned whenever we block a prediction."""
    return {
        'quiz_incomplete': True,
        'message': reason,
        'predictions': [],
        'top_career': None,
        'skill_gap': None,
        'recommended_courses': [],
        'recommended_jobs': []
    }


# ── Feature column order (must match training data) ──
FEATURE_COLUMNS = [
    'GI1','GI2','GI3','GI4','GI5','GI6','GI7','GI8','GI9','GI10',
    'PL1','PL2','PL3','PL4','PL5','PL6','PL7','PL8','PL9','PL10',
    'WD1','WD2','WD3','WD4','WD5','WD6','WD7','WD8','WD9','WD10',
    'MD1','MD2','MD3','MD4','MD5','MD6','MD7','MD8','MD9','MD10',
    'DB1','DB2','DB3','DB4','DB5','DB6','DB7','DB8','DB9','DB10',
    'DS1','DS2','DS3','DS4','DS5','DS6','DS7','DS8','DS9','DS10',
    'CC1','CC2','CC3','CC4','CC5','CC6','CC7','CC8','CC9','CC10',
    'SRE1','SRE2','SRE3','SRE4','SRE5','SRE6','SRE7','SRE8','SRE9','SRE10',
    'C1','C2','C3','C4','C5','C6','C7','C8','C9','C10',
    'SA1','SA2','SA3','SA4','SA5','SA6','SA7','SA8','SA9','SA10',
    'QA1','QA2','QA3','QA4','QA5','QA6','QA7','QA8','QA9','QA10',
    'UI1','UI2','UI3','UI4','UI5','UI6','UI7','UI8','UI9','UI10',
    'DA1','DA2','DA3','DA4','DA5','DA6','DA7','DA8','DA9','DA10',
    'ES1','ES2','ES3','ES4','ES5','ES6','ES7','ES8','ES9','ES10',
]

CATEGORY_MAP = {
    'GI':  [f'GI{i}'  for i in range(1, 11)],
    'PL':  [f'PL{i}'  for i in range(1, 11)],
    'WD':  [f'WD{i}'  for i in range(1, 11)],
    'MD':  [f'MD{i}'  for i in range(1, 11)],
    'DB':  [f'DB{i}'  for i in range(1, 11)],
    'DS':  [f'DS{i}'  for i in range(1, 11)],
    'CC':  [f'CC{i}'  for i in range(1, 11)],
    'SRE': [f'SRE{i}' for i in range(1, 11)],
    'C':   [f'C{i}'   for i in range(1, 11)],
    'SA':  [f'SA{i}'  for i in range(1, 11)],
    'QA':  [f'QA{i}'  for i in range(1, 11)],
    'UI':  [f'UI{i}'  for i in range(1, 11)],
    'DA':  [f'DA{i}'  for i in range(1, 11)],
    'ES':  [f'ES{i}'  for i in range(1, 11)],
}

CAREER_SKILL_MAP = {
    'Full Stack Developer':          {'WD': 80, 'PL': 70, 'DB': 60, 'GI': 50},
    'Frontend Developer':            {'WD': 80, 'UI': 60, 'PL': 60, 'GI': 50},
    'Backend Developer':             {'PL': 80, 'DB': 70, 'WD': 50, 'GI': 50},
    'Mobile Developer':              {'MD': 80, 'PL': 70, 'DB': 50, 'GI': 50},
    'Data Scientist':                {'DS': 80, 'PL': 70, 'DB': 60, 'DA': 60},
    'Machine Learning Engineer':     {'DS': 85, 'PL': 80, 'DB': 50, 'CC': 50},
    'Data Analyst':                  {'DA': 80, 'DB': 70, 'DS': 60, 'GI': 50},
    'DevOps Engineer':               {'SRE': 80, 'CC': 70, 'SA': 60, 'GI': 50},
    'Cloud Engineer':                {'CC': 85, 'SRE': 70, 'SA': 60, 'GI': 50},
    'Cybersecurity Analyst':         {'C': 85, 'SA': 70, 'GI': 60, 'PL': 50},
    'Network Administrator':         {'SA': 85, 'GI': 70, 'C': 60, 'CC': 50},
    'QA Engineer':                   {'QA': 85, 'PL': 60, 'GI': 50, 'DB': 50},
    'UI/UX Designer':                {'UI': 85, 'WD': 60, 'GI': 50, 'DA': 40},
    'Embedded Systems Engineer':     {'ES': 85, 'PL': 70, 'SA': 50, 'GI': 60},
    'Database Administrator':        {'DB': 85, 'PL': 60, 'SA': 50, 'GI': 50},
    'Software Engineer':             {'PL': 80, 'WD': 60, 'DB': 60, 'GI': 60},
    'IT Support Specialist':         {'GI': 85, 'SA': 60, 'C': 50},
    'Business Intelligence Developer':{'DA': 85, 'DB': 70, 'DS': 60, 'GI': 50},
}

CATEGORY_NAMES = {
    'GI': 'General ICT',
    'PL': 'Programming Languages',
    'WD': 'Web Development',
    'MD': 'Mobile Development',
    'DB': 'Database',
    'DS': 'Data Science & AI',
    'CC': 'Cloud Computing',
    'SRE': 'DevOps & SRE',
    'C': 'Cybersecurity',
    'SA': 'Networking & System Admin',
    'QA': 'Testing & QA',
    'UI': 'UI/UX Design',
    'DA': 'Data Analytics & BI',
    'ES': 'Embedded Systems & IoT'
}

CAT_SEARCH_NAMES = {
    'GI': 'ICT General Computer',
    'PL': 'Programming Python Java JavaScript',
    'WD': 'Web Development React HTML CSS',
    'MD': 'Mobile Flutter Android iOS',
    'DB': 'Database SQL MySQL MongoDB',
    'DS': 'Data Science Machine Learning AI',
    'CC': 'Cloud Computing AWS Azure',
    'SRE': 'DevOps Docker Kubernetes CI/CD',
    'C':  'Cybersecurity Security Hacking',
    'SA': 'Networking System Administration',
    'QA': 'Testing QA Automation Selenium',
    'UI': 'UI UX Design Figma',
    'DA': 'Data Analytics Power BI Tableau',
    'ES': 'Embedded IoT Arduino Raspberry'
}


def build_feature_vector(category_scores):
    feature_vector = {}
    for cat_code, cat_cols in CATEGORY_MAP.items():
        cat_score = category_scores.get(cat_code, 0)
        correct_count = int(cat_score / 10)
        for i, col in enumerate(cat_cols):
            feature_vector[col] = 10 if i < correct_count else 0
    vector = [feature_vector.get(col, 0) for col in FEATURE_COLUMNS]
    return np.array(vector).reshape(1, -1)


def _rule_based_prediction(category_scores):
    career_scores = {}
    for career, requirements in CAREER_SKILL_MAP.items():
        score = 0
        for cat_code, required_score in requirements.items():
            actual = category_scores.get(cat_code, 0)
            score += min(actual / required_score, 1.0) * (required_score / 100)
        career_scores[career] = score
    sorted_careers = sorted(career_scores.items(), key=lambda x: x[1], reverse=True)
    return [
        {'career': career, 'confidence': round(score * 100, 2), 'rank': i + 1}
        for i, (career, score) in enumerate(sorted_careers[:3])
    ]


def _get_predictions(category_scores):
    feature_vector = build_feature_vector(category_scores)
    if xgb_model and label_encoder:
        try:
            proba = xgb_model.predict_proba(feature_vector)[0]
            top3 = np.argsort(proba)[::-1][:3]
            return [
                {
                    'career': label_encoder.inverse_transform([idx])[0],
                    'confidence': round(float(proba[idx]) * 100, 2),
                    'rank': rank + 1
                }
                for rank, idx in enumerate(top3)
            ]
        except Exception as e:
            print(f"Model error: {e}")
    return _rule_based_prediction(category_scores)


def _skill_gap(career, category_scores):
    requirements = CAREER_SKILL_MAP.get(career, {})
    strengths, weaknesses, missing = [], [], []

    for cat_code, required in requirements.items():
        actual = category_scores.get(cat_code, 0)
        item = {
            'category': cat_code,
            'category_name': CATEGORY_NAMES.get(cat_code, cat_code),
            'your_score': actual,
            'required_score': required,
            'gap': max(0, required - actual),
            'percentage': round((actual / required) * 100, 1) if required > 0 else 0
        }
        if actual >= required:
            item['status'] = 'strength'; strengths.append(item)
        elif actual >= required * 0.6:
            item['status'] = 'weakness'; weaknesses.append(item)
        else:
            item['status'] = 'missing'; missing.append(item)

    overall = 0
    if requirements:
        total = sum(min(category_scores.get(c, 0) / r, 1.0) for c, r in requirements.items())
        overall = round((total / len(requirements)) * 100, 1)

    return {
        'overall_readiness': overall,
        'strengths': strengths,
        'weaknesses': weaknesses,
        'missing_skills': missing
    }


def _recommend_courses(top_career, gap_items, category_scores):
    all_courses = LearningContent.query.filter_by(is_approved=True).all()
    if not all_courses:
        return []

    # Build rich search text using gap categories + career
    gap_cats = [g['category'] for g in gap_items]
    gap_search = ' '.join([CAT_SEARCH_NAMES.get(c, c) for c in gap_cats])
    strong_cats = [c for c, s in category_scores.items() if s >= 60]
    strong_search = ' '.join([CAT_SEARCH_NAMES.get(c, c) for c in strong_cats])
    gap_text = f"{top_career} {gap_search} {gap_search} {strong_search}"

    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity

        course_texts = [
            f"{c.title} {c.category} {c.description or ''} {c.title}"
            for c in all_courses
        ]

        vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
        all_texts = course_texts + [gap_text]
        tfidf_matrix = vectorizer.fit_transform(all_texts)

        query_vector = tfidf_matrix[-1]
        course_vectors = tfidf_matrix[:-1]
        similarities = cosine_similarity(query_vector, course_vectors)[0]

        top_indices = np.argsort(similarities)[::-1][:6]
        recommended = []
        for idx in top_indices:
            c = all_courses[idx]
            recommended.append({
                **c.to_dict(),
                'relevance_score': round(float(similarities[idx]) * 100, 1)
            })
        return recommended

    except Exception as e:
        print(f"TF-IDF error: {e}")
        # Fallback: match by category
        matched = []
        for c in all_courses:
            for gap in gap_items:
                if gap['category_name'].lower() in c.category.lower() or \
                   c.category.lower() in gap['category_name'].lower() or \
                   top_career.lower() in c.title.lower():
                    matched.append({**c.to_dict(), 'relevance_score': 75.0})
                    break
        return matched[:6]


def _recommend_jobs(predictions, category_scores):
    all_jobs = Job.query.filter_by(is_active=True).all()
    if not all_jobs:
        return []

    career_text = ' '.join([p['career'] for p in predictions])
    strong_cats = [c for c, s in category_scores.items() if s >= 60]
    skill_text = ' '.join([CAT_SEARCH_NAMES.get(c, c) for c in strong_cats])
    user_profile = f"{career_text} {career_text} {skill_text}"

    try:
        from sentence_transformers import SentenceTransformer
        from sklearn.metrics.pairwise import cosine_similarity

        st_model = SentenceTransformer('all-MiniLM-L6-v2')
        job_texts = [
            f"{j.title} {j.category} {j.required_skills} {j.description[:200]}"
            for j in all_jobs
        ]
        user_emb = st_model.encode([user_profile])
        job_embs = st_model.encode(job_texts)
        sims = cosine_similarity(user_emb, job_embs)[0]

        ranked = sorted(
            [{'job': all_jobs[i].to_dict(), 'score': float(sims[i])} for i in range(len(all_jobs))],
            key=lambda x: x['score'], reverse=True
        )
        return [
            {**r['job'], 'match_score': round(r['score'] * 100, 1)}
            for r in ranked[:10]
        ]

    except Exception as e:
        print(f"Sentence Transformer error: {e}")
        try:
            from sklearn.feature_extraction.text import TfidfVectorizer
            from sklearn.metrics.pairwise import cosine_similarity

            job_texts = [
                f"{j.title} {j.category} {j.required_skills}"
                for j in all_jobs
            ]
            vec = TfidfVectorizer(stop_words='english')
            mat = vec.fit_transform(job_texts + [user_profile])
            sims = cosine_similarity(mat[-1], mat[:-1])[0]
            ranked_idx = np.argsort(sims)[::-1][:10]
            return [
                {**all_jobs[i].to_dict(), 'match_score': round(float(sims[i]) * 100, 1)}
                for i in ranked_idx
            ]
        except Exception as e2:
            print(f"Fallback job error: {e2}")
            return [j.to_dict() for j in all_jobs[:5]]


# ── PREDICT CAREER ────────────────────────────────────
@ai_bp.route('/predict-career', methods=['POST'])
@jwt_required()
def predict_career():
    user_id, _ = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    data = request.get_json()
    category_scores = data.get('category_scores', {})
    attempt_id = data.get('attempt_id')

    if not category_scores:
        return jsonify({'message': 'No quiz scores provided'}), 400

    # ── Guard: block prediction for skipped/all-zero quizzes ──
    is_valid, reason = _quiz_is_valid(category_scores)
    if not is_valid:
        return jsonify({
            'quiz_incomplete': True,
            'message': reason,
            'predictions': [],
            'top_career': None
        }), 200

    predictions = _get_predictions(category_scores)

    if attempt_id:
        try:
            attempt = QuizAttempt.query.get(attempt_id)
            if attempt and attempt.user_id == user_id:
                attempt.predicted_careers = json.dumps(predictions)
                db.session.commit()
        except Exception as e:
            print(f"Save attempt error: {e}")

    return jsonify({
        'predictions': predictions,
        'top_career': predictions[0] if predictions else None
    }), 200


# ── SKILL GAP ANALYSIS ────────────────────────────────
@ai_bp.route('/skill-gap', methods=['POST'])
@jwt_required()
def skill_gap_analysis():
    user_id, _ = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    data = request.get_json()
    career = data.get('career')
    category_scores = data.get('category_scores', {})

    if not career or not category_scores:
        return jsonify({'message': 'Career and scores required'}), 400

    is_valid, reason = _quiz_is_valid(category_scores)
    if not is_valid:
        return jsonify({
            'quiz_incomplete': True,
            'message': reason,
            'career': career,
            'overall_readiness': 0,
            'strengths': [],
            'weaknesses': [],
            'missing_skills': [],
            'total_gaps': 0
        }), 200

    gap = _skill_gap(career, category_scores)
    return jsonify({
        'career': career,
        **gap,
        'total_gaps': len(gap['weaknesses']) + len(gap['missing_skills'])
    }), 200


# ── COURSE RECOMMENDATIONS ────────────────────────────
@ai_bp.route('/recommend-courses', methods=['POST'])
@jwt_required()
def recommend_courses():
    user_id, _ = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    data = request.get_json()
    skill_gaps = data.get('skill_gaps', [])
    career = data.get('career', '')
    category_scores = data.get('category_scores', {})

    is_valid, reason = _quiz_is_valid(category_scores)
    if not is_valid:
        return jsonify({'quiz_incomplete': True, 'message': reason, 'courses': []}), 200

    courses = _recommend_courses(career, skill_gaps, category_scores)
    return jsonify({'courses': courses}), 200


# ── JOB RECOMMENDATIONS ───────────────────────────────
@ai_bp.route('/recommend-jobs', methods=['POST'])
@jwt_required()
def recommend_jobs():
    user_id, _ = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    data = request.get_json()
    predicted_careers = data.get('predicted_careers', [])
    category_scores = data.get('category_scores', {})

    is_valid, reason = _quiz_is_valid(category_scores)
    if not is_valid:
        return jsonify({'quiz_incomplete': True, 'message': reason, 'jobs': [], 'top_career': ''}), 200

    jobs = _recommend_jobs(predicted_careers, category_scores)
    top_career = predicted_careers[0]['career'] if predicted_careers else ''

    return jsonify({'jobs': jobs, 'top_career': top_career}), 200


# ── FULL ANALYSIS (single endpoint) ──────────────────
@ai_bp.route('/full-analysis', methods=['POST'])
@jwt_required()
def full_analysis():
    user_id, _ = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    data = request.get_json()
    category_scores = data.get('category_scores', {})
    attempt_id = data.get('attempt_id')

    if not category_scores:
        return jsonify({'message': 'No scores provided'}), 400

    # ── Guard: block the entire pipeline for skipped/all-zero quizzes ──
    is_valid, reason = _quiz_is_valid(category_scores)
    if not is_valid:
        return jsonify(_insufficient_data_response(reason)), 200

    # Step 1: Career prediction
    predictions = _get_predictions(category_scores)
    top_career = predictions[0]['career'] if predictions else 'Software Engineer'

    # Step 2: Skill gap
    skill_gap = _skill_gap(top_career, category_scores)
    gap_items = skill_gap['weaknesses'] + skill_gap['missing_skills']

    # Step 3: Course recommendations
    courses = _recommend_courses(top_career, gap_items, category_scores)

    # Step 4: Job recommendations
    jobs = _recommend_jobs(predictions, category_scores)

    # Save to attempt
    if attempt_id:
        try:
            attempt = QuizAttempt.query.get(attempt_id)
            if attempt and attempt.user_id == user_id:
                attempt.predicted_careers = json.dumps(predictions)
                db.session.commit()
        except Exception as e:
            print(f"Save attempt error: {e}")

    return jsonify({
        'quiz_incomplete': False,
        'predictions': predictions,
        'top_career': top_career,
        'skill_gap': skill_gap,
        'recommended_courses': courses,
        'recommended_jobs': jobs
    }), 200


# ── CAREER ROADMAP (Gemini proxy — key stays server-side) ────
@ai_bp.route('/career-roadmap', methods=['POST'])
@jwt_required()
def career_roadmap():
    user_id, _ = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    data = request.get_json()
    prompt = data.get('prompt')

    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400

    if not GEMINI_API_KEY:
        return jsonify({'error': 'Server is missing GEMINI_API_KEY configuration'}), 500

    try:
        response = requests.post(
            GEMINI_URL,
            json={
                'contents': [{'parts': [{'text': prompt}]}],
                'generationConfig': {'temperature': 0.7, 'maxOutputTokens': 2048}
            },
            headers={'Content-Type': 'application/json'}
        )
        result = response.json()

        if not response.ok:
            error_message = result.get('error', {}).get('message', 'Gemini API error')
            print(f"Gemini API error: {error_message}")
            return jsonify({'error': error_message}), response.status_code

        text = result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text')
        if not text:
            print(f"Gemini returned no usable text: {result}")
            return jsonify({'error': 'Gemini returned an empty response'}), 502

        return jsonify({'text': text}), 200

    except Exception as e:
        print(f"career_roadmap error: {e}")
        return jsonify({'error': str(e)}), 500
