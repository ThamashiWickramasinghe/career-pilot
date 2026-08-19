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

ai_bp = Blueprint('ai', __name__)

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

# Category to column prefix mapping
CATEGORY_MAP = {
    'GI': [f'GI{i}' for i in range(1, 11)],
    'PL': [f'PL{i}' for i in range(1, 11)],
    'WD': [f'WD{i}' for i in range(1, 11)],
    'MD': [f'MD{i}' for i in range(1, 11)],
    'DB': [f'DB{i}' for i in range(1, 11)],
    'DS': [f'DS{i}' for i in range(1, 11)],
    'CC': [f'CC{i}' for i in range(1, 11)],
    'SRE': [f'SRE{i}' for i in range(1, 11)],
    'C': [f'C{i}' for i in range(1, 11)],
    'SA': [f'SA{i}' for i in range(1, 11)],
    'QA': [f'QA{i}' for i in range(1, 11)],
    'UI': [f'UI{i}' for i in range(1, 11)],
    'DA': [f'DA{i}' for i in range(1, 11)],
    'ES': [f'ES{i}' for i in range(1, 11)],
}

# Career to required skills mapping (rule-based)
CAREER_SKILL_MAP = {
    'Full Stack Developer': {'WD': 80, 'PL': 70, 'DB': 60, 'GI': 50},
    'Frontend Developer': {'WD': 80, 'UI': 60, 'PL': 60, 'GI': 50},
    'Backend Developer': {'PL': 80, 'DB': 70, 'WD': 50, 'GI': 50},
    'Mobile Developer': {'MD': 80, 'PL': 70, 'DB': 50, 'GI': 50},
    'Data Scientist': {'DS': 80, 'PL': 70, 'DB': 60, 'DA': 60},
    'Machine Learning Engineer': {'DS': 85, 'PL': 80, 'DB': 50, 'CC': 50},
    'Data Analyst': {'DA': 80, 'DB': 70, 'DS': 60, 'GI': 50},
    'DevOps Engineer': {'SRE': 80, 'CC': 70, 'SA': 60, 'GI': 50},
    'Cloud Engineer': {'CC': 85, 'SRE': 70, 'SA': 60, 'GI': 50},
    'Cybersecurity Analyst': {'C': 85, 'SA': 70, 'GI': 60, 'PL': 50},
    'Network Administrator': {'SA': 85, 'GI': 70, 'C': 60, 'CC': 50},
    'QA Engineer': {'QA': 85, 'PL': 60, 'GI': 50, 'DB': 50},
    'UI/UX Designer': {'UI': 85, 'WD': 60, 'GI': 50, 'DA': 40},
    'Embedded Systems Engineer': {'ES': 85, 'PL': 70, 'SA': 50, 'GI': 60},
    'Database Administrator': {'DB': 85, 'PL': 60, 'SA': 50, 'GI': 50},
    'Software Engineer': {'PL': 80, 'WD': 60, 'DB': 60, 'GI': 60},
    'IT Support Specialist': {'GI': 85, 'SA': 60, 'C': 50},
    'Business Intelligence Developer': {'DA': 85, 'DB': 70, 'DS': 60, 'GI': 50},
}


def build_feature_vector(category_scores, question_answers=None):
    """
    Build 140-feature vector from quiz results.
    Each question score = 10 (correct) or 0 (wrong).
    Category score = sum of individual question scores.
    We distribute category score evenly across questions.
    """
    feature_vector = {}

    for cat_code, cat_cols in CATEGORY_MAP.items():
        cat_score = category_scores.get(cat_code, 0)
        # Distribute score across 10 questions
        # If score = 80, then 8 questions correct = 8 columns get 10, 2 get 0
        correct_count = int(cat_score / 10)
        for i, col in enumerate(cat_cols):
            feature_vector[col] = 10 if i < correct_count else 0

    # Build ordered array
    vector = [feature_vector.get(col, 0) for col in FEATURE_COLUMNS]
    return np.array(vector).reshape(1, -1)


# ── PREDICT CAREER ────────────────────────────────────
@ai_bp.route('/predict-career', methods=['POST'])
@jwt_required()
def predict_career():
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    data = request.get_json()
    category_scores = data.get('category_scores', {})
    attempt_id = data.get('attempt_id')

    if not category_scores:
        return jsonify({'message': 'No quiz scores provided'}), 400

    # Build feature vector
    feature_vector = build_feature_vector(category_scores)

    predictions = []

    if xgb_model and label_encoder:
        try:
            # Get probability predictions
            proba = xgb_model.predict_proba(feature_vector)[0]

            # Get top 3 career predictions
            top3_indices = np.argsort(proba)[::-1][:3]

            for idx in top3_indices:
                career_name = label_encoder.inverse_transform([idx])[0]
                confidence = float(proba[idx]) * 100
                predictions.append({
                    'career': career_name,
                    'confidence': round(confidence, 2),
                    'rank': len(predictions) + 1
                })

        except Exception as e:
            print(f"Model prediction error: {e}")
            predictions = _rule_based_prediction(category_scores)
    else:
        # Fallback rule-based prediction
        predictions = _rule_based_prediction(category_scores)

    # Save predictions to attempt
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


def _rule_based_prediction(category_scores):
    """Fallback rule-based career prediction"""
    career_scores = {}
    for career, requirements in CAREER_SKILL_MAP.items():
        score = 0
        for cat_code, required_score in requirements.items():
            actual = category_scores.get(cat_code, 0)
            score += min(actual / required_score, 1.0) * (required_score / 100)
        career_scores[career] = score

    sorted_careers = sorted(career_scores.items(), key=lambda x: x[1], reverse=True)
    return [
        {
            'career': career,
            'confidence': round(score * 100, 2),
            'rank': i + 1
        }
        for i, (career, score) in enumerate(sorted_careers[:3])
    ]


# ── SKILL GAP ANALYSIS ────────────────────────────────
@ai_bp.route('/skill-gap', methods=['POST'])
@jwt_required()
def skill_gap_analysis():
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    data = request.get_json()
    career = data.get('career')
    category_scores = data.get('category_scores', {})

    if not career or not category_scores:
        return jsonify({'message': 'Career and scores required'}), 400

    requirements = CAREER_SKILL_MAP.get(career, {})

    category_names = {
        'GI': 'General ICT', 'PL': 'Programming Languages',
        'WD': 'Web Development', 'MD': 'Mobile Development',
        'DB': 'Database', 'DS': 'Data Science & AI',
        'CC': 'Cloud Computing', 'SRE': 'DevOps & SRE',
        'C': 'Cybersecurity', 'SA': 'Networking & System Admin',
        'QA': 'Testing & QA', 'UI': 'UI/UX Design',
        'DA': 'Data Analytics & BI', 'ES': 'Embedded Systems & IoT'
    }

    strengths = []
    weaknesses = []
    missing = []

    for cat_code, required in requirements.items():
        actual = category_scores.get(cat_code, 0)
        cat_name = category_names.get(cat_code, cat_code)
        gap = required - actual

        item = {
            'category': cat_code,
            'category_name': cat_name,
            'your_score': actual,
            'required_score': required,
            'gap': max(0, gap),
            'percentage': round((actual / required) * 100, 1) if required > 0 else 0
        }

        if actual >= required:
            item['status'] = 'strength'
            strengths.append(item)
        elif actual >= required * 0.6:
            item['status'] = 'weakness'
            weaknesses.append(item)
        else:
            item['status'] = 'missing'
            missing.append(item)

    overall_readiness = 0
    if requirements:
        total = sum(
            min(category_scores.get(cat, 0) / req, 1.0)
            for cat, req in requirements.items()
        )
        overall_readiness = round((total / len(requirements)) * 100, 1)

    return jsonify({
        'career': career,
        'overall_readiness': overall_readiness,
        'strengths': strengths,
        'weaknesses': weaknesses,
        'missing_skills': missing,
        'total_gaps': len(weaknesses) + len(missing)
    }), 200


# ── COURSE RECOMMENDATIONS (TF-IDF) ──────────────────
@ai_bp.route('/recommend-courses', methods=['POST'])
@jwt_required()
def recommend_courses():
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    data = request.get_json()
    skill_gaps = data.get('skill_gaps', [])
    career = data.get('career', '')

    if not skill_gaps:
        return jsonify({'courses': []}), 200

    # Get gap category names
    gap_categories = [g['category_name'] for g in skill_gaps]
    gap_text = ' '.join(gap_categories + [career])

    # Fetch approved courses from database
    courses = LearningContent.query.filter_by(is_approved=True).all()

    if not courses:
        return jsonify({
            'courses': [],
            'message': 'No courses available yet'
        }), 200

    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity

        # Build corpus
        course_texts = []
        for c in courses:
            text = f"{c.title} {c.category} {c.description or ''}"
            course_texts.append(text)

        # TF-IDF vectorization
        vectorizer = TfidfVectorizer(stop_words='english', max_features=500)
        all_texts = course_texts + [gap_text]
        tfidf_matrix = vectorizer.fit_transform(all_texts)

        # Cosine similarity
        query_vector = tfidf_matrix[-1]
        course_vectors = tfidf_matrix[:-1]
        similarities = cosine_similarity(query_vector, course_vectors)[0]

        # Get top 5 courses
        top_indices = np.argsort(similarities)[::-1][:5]

        recommended = []
        for idx in top_indices:
            if similarities[idx] > 0:
                c = courses[idx]
                recommended.append({
                    **c.to_dict(),
                    'relevance_score': round(float(similarities[idx]) * 100, 1)
                })

        return jsonify({'courses': recommended}), 200

    except Exception as e:
        print(f"TF-IDF error: {e}")
        # Fallback: return courses by category match
        matched = []
        for c in courses:
            for gap_cat in gap_categories:
                if gap_cat.lower() in c.category.lower() or \
                   c.category.lower() in gap_cat.lower():
                    matched.append({**c.to_dict(), 'relevance_score': 80.0})
                    break
        return jsonify({'courses': matched[:5]}), 200


# ── JOB RECOMMENDATIONS (Sentence Transformer) ────────
@ai_bp.route('/recommend-jobs', methods=['POST'])
@jwt_required()
def recommend_jobs():
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    data = request.get_json()
    predicted_careers = data.get('predicted_careers', [])
    category_scores = data.get('category_scores', {})

    if not predicted_careers:
        return jsonify({'jobs': []}), 200

    # Build user profile text
    top_career = predicted_careers[0]['career'] if predicted_careers else ''
    career_text = ' '.join([p['career'] for p in predicted_careers])

    # Get strong categories
    strong_cats = [
        cat for cat, score in category_scores.items()
        if score >= 60
    ]

    category_names = {
        'GI': 'General ICT', 'PL': 'Programming',
        'WD': 'Web Development', 'MD': 'Mobile Development',
        'DB': 'Database SQL', 'DS': 'Data Science Machine Learning AI',
        'CC': 'Cloud Computing AWS Azure', 'SRE': 'DevOps Kubernetes Docker',
        'C': 'Cybersecurity Security', 'SA': 'Networking System Administration',
        'QA': 'Testing QA Automation', 'UI': 'UI UX Design Figma',
        'DA': 'Data Analytics Business Intelligence', 'ES': 'Embedded IoT Arduino'
    }

    skill_text = ' '.join([category_names.get(c, c) for c in strong_cats])
    user_profile = f"{career_text} {skill_text}"

    # Get all active jobs
    jobs = Job.query.filter_by(is_active=True).all()

    if not jobs:
        return jsonify({'jobs': [], 'message': 'No jobs available'}), 200

    try:
        from sentence_transformers import SentenceTransformer
        from sklearn.metrics.pairwise import cosine_similarity

        model = SentenceTransformer('all-MiniLM-L6-v2')

        # Build job texts
        job_texts = []
        for j in jobs:
            text = f"{j.title} {j.category} {j.required_skills} {j.description[:200]}"
            job_texts.append(text)

        # Encode
        user_embedding = model.encode([user_profile])
        job_embeddings = model.encode(job_texts)

        # Cosine similarity
        similarities = cosine_similarity(user_embedding, job_embeddings)[0]

        # Rank jobs
        ranked = []
        for idx, sim in enumerate(similarities):
            job_dict = jobs[idx].to_dict()
            job_dict['match_score'] = round(float(sim) * 100, 1)
            ranked.append(job_dict)

        ranked.sort(key=lambda x: x['match_score'], reverse=True)

        return jsonify({
            'jobs': ranked[:10],
            'top_career': top_career
        }), 200

    except Exception as e:
        print(f"Sentence transformer error: {e}")
        # Fallback: TF-IDF for job matching
        try:
            from sklearn.feature_extraction.text import TfidfVectorizer
            from sklearn.metrics.pairwise import cosine_similarity as cs

            job_texts = [
                f"{j.title} {j.category} {j.required_skills}"
                for j in jobs
            ]
            vectorizer = TfidfVectorizer(stop_words='english')
            all_texts = job_texts + [user_profile]
            tfidf = vectorizer.fit_transform(all_texts)
            sims = cs(tfidf[-1], tfidf[:-1])[0]

            ranked = []
            for idx, sim in enumerate(sims):
                job_dict = jobs[idx].to_dict()
                job_dict['match_score'] = round(float(sim) * 100, 1)
                ranked.append(job_dict)

            ranked.sort(key=lambda x: x['match_score'], reverse=True)
            return jsonify({'jobs': ranked[:10], 'top_career': top_career}), 200

        except Exception as e2:
            print(f"Fallback error: {e2}")
            return jsonify({
                'jobs': [j.to_dict() for j in jobs[:10]],
                'top_career': top_career
            }), 200


# ── GET FULL AI RESULTS ───────────────────────────────
@ai_bp.route('/full-analysis', methods=['POST'])
@jwt_required()
def full_analysis():
    """
    Single endpoint that returns:
    1. Career predictions
    2. Skill gap analysis for top career
    3. Course recommendations
    4. Job recommendations
    """
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    data = request.get_json()
    category_scores = data.get('category_scores', {})
    attempt_id = data.get('attempt_id')

    if not category_scores:
        return jsonify({'message': 'No scores provided'}), 400

    # Step 1: Career prediction
    feature_vector = build_feature_vector(category_scores)
    predictions = []

    if xgb_model and label_encoder:
        try:
            proba = xgb_model.predict_proba(feature_vector)[0]
            top3 = np.argsort(proba)[::-1][:3]
            for rank, idx in enumerate(top3):
                predictions.append({
                    'career': label_encoder.inverse_transform([idx])[0],
                    'confidence': round(float(proba[idx]) * 100, 2),
                    'rank': rank + 1
                })
        except:
            predictions = _rule_based_prediction(category_scores)
    else:
        predictions = _rule_based_prediction(category_scores)

    top_career = predictions[0]['career'] if predictions else 'Software Engineer'

    # Step 2: Skill gap for top career
    requirements = CAREER_SKILL_MAP.get(top_career, {})
    category_names = {
        'GI': 'General ICT', 'PL': 'Programming Languages',
        'WD': 'Web Development', 'MD': 'Mobile Development',
        'DB': 'Database', 'DS': 'Data Science & AI',
        'CC': 'Cloud Computing', 'SRE': 'DevOps & SRE',
        'C': 'Cybersecurity', 'SA': 'Networking & System Admin',
        'QA': 'Testing & QA', 'UI': 'UI/UX Design',
        'DA': 'Data Analytics & BI', 'ES': 'Embedded Systems & IoT'
    }

    strengths, weaknesses, missing = [], [], []
    for cat_code, required in requirements.items():
        actual = category_scores.get(cat_code, 0)
        item = {
            'category': cat_code,
            'category_name': category_names.get(cat_code, cat_code),
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

    overall_readiness = 0
    if requirements:
        total = sum(min(category_scores.get(c, 0) / r, 1.0) for c, r in requirements.items())
        overall_readiness = round((total / len(requirements)) * 100, 1)

    skill_gap = {
        'overall_readiness': overall_readiness,
        'strengths': strengths,
        'weaknesses': weaknesses,
        'missing_skills': missing
    }

    # Step 3: Course recommendations (TF-IDF)
    gap_items = weaknesses + missing
    courses_recommended = []
    if gap_items:
        gap_text = ' '.join([g['category_name'] for g in gap_items]) + f' {top_career}'
        all_courses = LearningContent.query.filter_by(is_approved=True).all()
        if all_courses:
            try:
                from sklearn.feature_extraction.text import TfidfVectorizer
                from sklearn.metrics.pairwise import cosine_similarity
                course_texts = [f"{c.title} {c.category} {c.description or ''}" for c in all_courses]
                vec = TfidfVectorizer(stop_words='english', max_features=500)
                mat = vec.fit_transform(course_texts + [gap_text])
                sims = cosine_similarity(mat[-1], mat[:-1])[0]
                top5 = np.argsort(sims)[::-1][:5]
                for idx in top5:
                    if sims[idx] > 0:
                        c = all_courses[idx]
                        courses_recommended.append({
                            **c.to_dict(),
                            'relevance_score': round(float(sims[idx]) * 100, 1)
                        })
            except Exception as e:
                print(f"Course TF-IDF error: {e}")

    # Step 4: Job recommendations
    jobs_recommended = []
    all_jobs = Job.query.filter_by(is_active=True).all()
    if all_jobs and predictions:
        career_text = ' '.join([p['career'] for p in predictions])
        strong_cats = [c for c, s in category_scores.items() if s >= 60]
        cat_name_map = {
            'GI': 'ICT', 'PL': 'Programming', 'WD': 'Web',
            'MD': 'Mobile', 'DB': 'Database SQL', 'DS': 'Data Science AI',
            'CC': 'Cloud AWS', 'SRE': 'DevOps Docker', 'C': 'Security',
            'SA': 'Network', 'QA': 'Testing QA', 'UI': 'UI UX Design',
            'DA': 'Analytics BI', 'ES': 'Embedded IoT'
        }
        skill_text = ' '.join([cat_name_map.get(c, c) for c in strong_cats])
        profile = f"{career_text} {skill_text}"

        try:
            from sentence_transformers import SentenceTransformer
            from sklearn.metrics.pairwise import cosine_similarity
            st_model = SentenceTransformer('all-MiniLM-L6-v2')
            job_texts = [f"{j.title} {j.category} {j.required_skills}" for j in all_jobs]
            user_emb = st_model.encode([profile])
            job_embs = st_model.encode(job_texts)
            sims = cosine_similarity(user_emb, job_embs)[0]
            ranked = sorted(
                [{'job': all_jobs[i].to_dict(), 'score': float(sims[i])} for i in range(len(all_jobs))],
                key=lambda x: x['score'], reverse=True
            )
            jobs_recommended = [
                {**r['job'], 'match_score': round(r['score'] * 100, 1)}
                for r in ranked[:5]
            ]
        except Exception as e:
            print(f"ST error: {e}")
            try:
                from sklearn.feature_extraction.text import TfidfVectorizer
                from sklearn.metrics.pairwise import cosine_similarity
                job_texts = [f"{j.title} {j.category} {j.required_skills}" for j in all_jobs]
                vec = TfidfVectorizer(stop_words='english')
                mat = vec.fit_transform(job_texts + [profile])
                sims = cosine_similarity(mat[-1], mat[:-1])[0]
                ranked_idx = np.argsort(sims)[::-1][:5]
                jobs_recommended = [
                    {**all_jobs[i].to_dict(), 'match_score': round(float(sims[i]) * 100, 1)}
                    for i in ranked_idx
                ]
            except Exception as e2:
                print(f"Fallback job error: {e2}")

    # Save to attempt
    if attempt_id:
        try:
            attempt = QuizAttempt.query.get(attempt_id)
            if attempt and attempt.user_id == user_id:
                attempt.predicted_careers = json.dumps(predictions)
                db.session.commit()
        except:
            pass

    return jsonify({
        'predictions': predictions,
        'top_career': top_career,
        'skill_gap': skill_gap,
        'recommended_courses': courses_recommended,
        'recommended_jobs': jobs_recommended
    }), 200