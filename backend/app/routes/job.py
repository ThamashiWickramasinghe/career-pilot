from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.job import Job, JobApplication
from app.models.user import User
from datetime import datetime

job_bp = Blueprint('job', __name__)


def get_user_from_token():
    try:
        from flask_jwt_extended import get_jwt
        identity = get_jwt_identity()
        claims = get_jwt()
        user_id = claims.get('id') or identity
        user_role = claims.get('role')
        return int(user_id), user_role
    except Exception as e:
        print(f"Token error: {e}")
        return None, None


# ── COMPANY: POST JOB ─────────────────────────────────
@job_bp.route('/post', methods=['POST'])
@jwt_required()
def post_job():
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422
    if user_role != 'company':
        return jsonify({'message': 'Companies only'}), 403

    data = request.get_json()
    required = ['title', 'category', 'job_type', 'location',
                 'required_skills', 'description']
    for field in required:
        if not data.get(field):
            return jsonify({'message': f'{field} is required'}), 400

    deadline = None
    if data.get('deadline'):
        try:
            deadline = datetime.strptime(data['deadline'], '%Y-%m-%d')
        except:
            pass

    job = Job(
        title=data['title'],
        company_id=user_id,
        category=data['category'],
        job_type=data['job_type'],
        location=data['location'],
        salary_range=data.get('salary_range', ''),
        required_skills=data['required_skills'],
        experience=data.get('experience', ''),
        description=data['description'],
        deadline=deadline,
        is_active=True
    )

    db.session.add(job)
    db.session.commit()

    return jsonify({
        'message': 'Job posted successfully',
        'job': job.to_dict()
    }), 201


# ── GET ALL ACTIVE JOBS (Job Seekers) ─────────────────
@job_bp.route('/all', methods=['GET'])
@jwt_required()
def get_all_jobs():
    category = request.args.get('category')
    job_type = request.args.get('job_type')
    search = request.args.get('search')
    location = request.args.get('location')

    query = Job.query.filter_by(is_active=True)

    if category and category != 'All':
        query = query.filter_by(category=category)
    if job_type and job_type != 'All':
        query = query.filter_by(job_type=job_type)
    if location and location != 'All':
        query = query.filter(Job.location.ilike(f'%{location}%'))
    if search:
        query = query.filter(
            db.or_(
                Job.title.ilike(f'%{search}%'),
                Job.required_skills.ilike(f'%{search}%'),
                Job.description.ilike(f'%{search}%'),
                Job.category.ilike(f'%{search}%')
            )
        )

    jobs = query.order_by(Job.created_at.desc()).all()
    return jsonify({'jobs': [j.to_dict() for j in jobs]}), 200


# ── GET SINGLE JOB ────────────────────────────────────
@job_bp.route('/<int:job_id>', methods=['GET'])
@jwt_required()
def get_job(job_id):
    job = Job.query.get_or_404(job_id)
    return jsonify({'job': job.to_dict()}), 200


# ── JOB SEEKER: APPLY FOR JOB ─────────────────────────
@job_bp.route('/<int:job_id>/apply', methods=['POST'])
@jwt_required()
def apply_job(job_id):
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422
    if user_role != 'job_seeker':
        return jsonify({'message': 'Job seekers only'}), 403

    # Check already applied
    existing = JobApplication.query.filter_by(
        job_id=job_id,
        applicant_id=user_id
    ).first()
    if existing:
        return jsonify({'message': 'Already applied for this job'}), 409

    data = request.get_json()

    application = JobApplication(
        job_id=job_id,
        applicant_id=user_id,
        cover_letter=data.get('cover_letter', ''),
        status='Pending'
    )

    db.session.add(application)
    db.session.commit()

    return jsonify({
        'message': 'Application submitted successfully',
        'application': application.to_dict()
    }), 201


# ── JOB SEEKER: GET MY APPLICATIONS ──────────────────
@job_bp.route('/my-applications', methods=['GET'])
@jwt_required()
def get_my_applications():
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    applications = JobApplication.query.filter_by(
        applicant_id=user_id
    ).order_by(JobApplication.applied_at.desc()).all()

    return jsonify({
        'applications': [a.to_dict() for a in applications]
    }), 200


# ── COMPANY: GET MY JOBS ──────────────────────────────
@job_bp.route('/my-jobs', methods=['GET'])
@jwt_required()
def get_my_jobs():
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422
    if user_role != 'company':
        return jsonify({'message': 'Companies only'}), 403

    jobs = Job.query.filter_by(
        company_id=user_id
    ).order_by(Job.created_at.desc()).all()

    return jsonify({'jobs': [j.to_dict() for j in jobs]}), 200


# ── COMPANY: GET APPLICATIONS FOR MY JOBS ─────────────
@job_bp.route('/applications', methods=['GET'])
@jwt_required()
def get_company_applications():
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422
    if user_role != 'company':
        return jsonify({'message': 'Companies only'}), 403

    status_filter = request.args.get('status')

    my_jobs = Job.query.filter_by(company_id=user_id).all()
    job_ids = [j.id for j in my_jobs]

    query = JobApplication.query.filter(
        JobApplication.job_id.in_(job_ids)
    )

    if status_filter and status_filter != 'All':
        query = query.filter_by(status=status_filter)

    applications = query.order_by(
        JobApplication.applied_at.desc()
    ).all()

    return jsonify({
        'applications': [a.to_dict() for a in applications]
    }), 200


# ── COMPANY: UPDATE APPLICATION STATUS ────────────────
@job_bp.route('/applications/<int:app_id>/status', methods=['PUT'])
@jwt_required()
def update_application_status(app_id):
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422
    if user_role != 'company':
        return jsonify({'message': 'Companies only'}), 403

    data = request.get_json()
    status = data.get('status')

    if status not in ['Pending', 'Shortlisted', 'Hired', 'Rejected']:
        return jsonify({'message': 'Invalid status'}), 400

    application = JobApplication.query.get_or_404(app_id)
    application.status = status
    db.session.commit()

    return jsonify({
        'message': f'Status updated to {status}',
        'application': application.to_dict()
    }), 200


# ── COMPANY: UPDATE JOB ───────────────────────────────
@job_bp.route('/<int:job_id>', methods=['PUT'])
@jwt_required()
def update_job(job_id):
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422
    if user_role != 'company':
        return jsonify({'message': 'Companies only'}), 403

    job = Job.query.get_or_404(job_id)
    if job.company_id != user_id:
        return jsonify({'message': 'Not authorized'}), 403

    data = request.get_json()
    job.title = data.get('title', job.title)
    job.category = data.get('category', job.category)
    job.job_type = data.get('job_type', job.job_type)
    job.location = data.get('location', job.location)
    job.salary_range = data.get('salary_range', job.salary_range)
    job.required_skills = data.get('required_skills', job.required_skills)
    job.experience = data.get('experience', job.experience)
    job.description = data.get('description', job.description)
    job.is_active = data.get('is_active', job.is_active)

    db.session.commit()
    return jsonify({
        'message': 'Job updated successfully',
        'job': job.to_dict()
    }), 200


# ── COMPANY: DELETE JOB ───────────────────────────────
@job_bp.route('/<int:job_id>', methods=['DELETE'])
@jwt_required()
def delete_job(job_id):
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422
    if user_role != 'company':
        return jsonify({'message': 'Companies only'}), 403

    job = Job.query.get_or_404(job_id)
    if job.company_id != user_id:
        return jsonify({'message': 'Not authorized'}), 403

    JobApplication.query.filter_by(job_id=job_id).delete()
    db.session.delete(job)
    db.session.commit()

    return jsonify({'message': 'Job deleted successfully'}), 200


# ── ADMIN: GET ALL JOBS ───────────────────────────────
@job_bp.route('/admin/all', methods=['GET'])
@jwt_required()
def admin_get_all_jobs():
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422
    if user_role != 'admin':
        return jsonify({'message': 'Admins only'}), 403

    jobs = Job.query.order_by(Job.created_at.desc()).all()
    return jsonify({'jobs': [j.to_dict() for j in jobs]}), 200