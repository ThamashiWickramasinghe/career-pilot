from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.learning import LearningContent, ContentAccess, ReAccessRequest, ContentComment
from app.models.user import User
from datetime import datetime, timedelta
import os
from werkzeug.utils import secure_filename

learning_bp = Blueprint('learning', __name__)

UPLOAD_FOLDER = 'uploads/pdfs'
THUMBNAIL_FOLDER = 'uploads/thumbnails'
ALLOWED_PDF = {'pdf'}
ALLOWED_IMG = {'png', 'jpg', 'jpeg', 'webp'}

def allowed_file(filename, allowed):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed


# ── INSTRUCTOR: POST CONTENT ──────────────────────────
@learning_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_content():
    current_user = get_jwt_identity()
    if current_user['role'] != 'instructor':
        return jsonify({'message': 'Instructors only'}), 403

    title = request.form.get('title')
    description = request.form.get('description')
    category = request.form.get('category')
    content_type = request.form.get('content_type')
    drive_link = request.form.get('drive_link')

    if not title or not content_type:
        return jsonify({'message': 'Title and content type are required'}), 400

    thumbnail_path = None
    file_path = None

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    os.makedirs(THUMBNAIL_FOLDER, exist_ok=True)

    # Handle thumbnail upload
    if 'thumbnail' in request.files:
        thumb = request.files['thumbnail']
        if thumb and allowed_file(thumb.filename, ALLOWED_IMG):
            filename = secure_filename(f"{datetime.utcnow().timestamp()}_{thumb.filename}")
            thumb.save(os.path.join(THUMBNAIL_FOLDER, filename))
            thumbnail_path = f"uploads/thumbnails/{filename}"

    # Handle PDF upload
    if 'pdf_file' in request.files:
        pdf = request.files['pdf_file']
        if pdf and allowed_file(pdf.filename, ALLOWED_PDF):
            filename = secure_filename(f"{datetime.utcnow().timestamp()}_{pdf.filename}")
            pdf.save(os.path.join(UPLOAD_FOLDER, filename))
            file_path = f"uploads/pdfs/{filename}"

    content = LearningContent(
        title=title,
        description=description,
        category=category,
        content_type=content_type,
        drive_link=drive_link,
        thumbnail=thumbnail_path,
        file_path=file_path,
        instructor_id=current_user['id'],
        is_approved=False
    )

    db.session.add(content)
    db.session.commit()

    return jsonify({
        'message': 'Content submitted for admin approval',
        'content': content.to_dict()
    }), 201


# ── GET ALL APPROVED CONTENT (Job Seekers) ────────────
@learning_bp.route('/content', methods=['GET'])
@jwt_required()
def get_all_content():
    category = request.args.get('category')
    query = LearningContent.query.filter_by(is_approved=True)
    if category:
        query = query.filter_by(category=category)
    contents = query.order_by(LearningContent.created_at.desc()).all()
    return jsonify({'content': [c.to_dict() for c in contents]}), 200


# ── GET SINGLE CONTENT ────────────────────────────────
@learning_bp.route('/content/<int:content_id>', methods=['GET'])
@jwt_required()
def get_content(content_id):
    current_user = get_jwt_identity()
    content = LearningContent.query.get_or_404(content_id)

    if not content.is_approved and current_user['role'] == 'job_seeker':
        return jsonify({'message': 'Content not available'}), 403

    # Check access for job seeker
    has_access = True
    access_info = None
    if current_user['role'] == 'job_seeker' and content.content_type == 'video_link':
        access = ContentAccess.query.filter_by(
            user_id=current_user['id'],
            content_id=content_id,
            is_active=True
        ).first()

        if not access:
            # Grant first-time access for 30 days
            new_access = ContentAccess(
                user_id=current_user['id'],
                content_id=content_id,
                expires_at=datetime.utcnow() + timedelta(days=30)
            )
            db.session.add(new_access)
            db.session.commit()
            access_info = new_access.to_dict()
        elif datetime.utcnow() > access.expires_at:
            access.is_active = False
            db.session.commit()
            has_access = False
        else:
            access_info = access.to_dict()

    comments = ContentComment.query.filter_by(content_id=content_id)\
        .order_by(ContentComment.created_at.desc()).all()

    return jsonify({
        'content': content.to_dict(),
        'has_access': has_access,
        'access_info': access_info,
        'comments': [c.to_dict() for c in comments]
    }), 200


# ── ADD COMMENT ───────────────────────────────────────
@learning_bp.route('/content/<int:content_id>/comment', methods=['POST'])
@jwt_required()
def add_comment(content_id):
    current_user = get_jwt_identity()
    data = request.get_json()

    if not data.get('comment'):
        return jsonify({'message': 'Comment is required'}), 400

    comment = ContentComment(
        content_id=content_id,
        user_id=current_user['id'],
        comment=data['comment']
    )
    db.session.add(comment)
    db.session.commit()

    return jsonify({
        'message': 'Comment added',
        'comment': comment.to_dict()
    }), 201


# ── REQUEST RE-ACCESS ─────────────────────────────────
@learning_bp.route('/reaccess', methods=['POST'])
@jwt_required()
def request_reaccess():
    current_user = get_jwt_identity()
    data = request.get_json()

    if not data.get('content_id'):
        return jsonify({'message': 'Content ID required'}), 400

    # Check if request already pending
    existing = ReAccessRequest.query.filter_by(
        user_id=current_user['id'],
        content_id=data['content_id'],
        status='pending'
    ).first()

    if existing:
        return jsonify({'message': 'Request already pending'}), 409

    req = ReAccessRequest(
        user_id=current_user['id'],
        content_id=data['content_id'],
        message=data.get('message', '')
    )
    db.session.add(req)
    db.session.commit()

    return jsonify({
        'message': 'Re-access request submitted',
        'request': req.to_dict()
    }), 201


# ── INSTRUCTOR: GET RE-ACCESS REQUESTS ───────────────
@learning_bp.route('/reaccess/requests', methods=['GET'])
@jwt_required()
def get_reaccess_requests():
    current_user = get_jwt_identity()
    if current_user['role'] not in ['instructor', 'admin']:
        return jsonify({'message': 'Not authorized'}), 403

    requests = ReAccessRequest.query.filter_by(status='pending').all()
    return jsonify({'requests': [r.to_dict() for r in requests]}), 200


# ── INSTRUCTOR: RESPOND TO RE-ACCESS ─────────────────
@learning_bp.route('/reaccess/<int:request_id>/respond', methods=['POST'])
@jwt_required()
def respond_reaccess(request_id):
    current_user = get_jwt_identity()
    if current_user['role'] not in ['instructor', 'admin']:
        return jsonify({'message': 'Not authorized'}), 403

    data = request.get_json()
    action = data.get('action')

    if action not in ['approved', 'denied']:
        return jsonify({'message': 'Action must be approved or denied'}), 400

    req = ReAccessRequest.query.get_or_404(request_id)
    req.status = action
    req.responded_at = datetime.utcnow()

    if action == 'approved':
        # Grant another 30 days
        access = ContentAccess.query.filter_by(
            user_id=req.user_id,
            content_id=req.content_id
        ).first()
        if access:
            access.expires_at = datetime.utcnow() + timedelta(days=30)
            access.is_active = True
        else:
            new_access = ContentAccess(
                user_id=req.user_id,
                content_id=req.content_id,
                expires_at=datetime.utcnow() + timedelta(days=30)
            )
            db.session.add(new_access)

    db.session.commit()
    return jsonify({'message': f'Request {action}'}), 200


# ── ADMIN: GET ALL PENDING CONTENT ───────────────────
@learning_bp.route('/admin/pending', methods=['GET'])
@jwt_required()
def get_pending_content():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Admins only'}), 403

    contents = LearningContent.query.filter_by(is_approved=False).all()
    return jsonify({'content': [c.to_dict() for c in contents]}), 200


# ── ADMIN: APPROVE/REJECT CONTENT ────────────────────
@learning_bp.route('/admin/content/<int:content_id>/review', methods=['POST'])
@jwt_required()
def review_content(content_id):
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Admins only'}), 403

    data = request.get_json()
    action = data.get('action')

    if action not in ['approve', 'reject']:
        return jsonify({'message': 'Action must be approve or reject'}), 400

    content = LearningContent.query.get_or_404(content_id)
    content.is_approved = (action == 'approve')
    content.approved_by = current_user['id']
    content.approved_at = datetime.utcnow()

    db.session.commit()
    return jsonify({'message': f'Content {action}d successfully'}), 200


# ── INSTRUCTOR: GET MY CONTENT ────────────────────────
@learning_bp.route('/my-content', methods=['GET'])
@jwt_required()
def get_my_content():
    current_user = get_jwt_identity()
    if current_user['role'] != 'instructor':
        return jsonify({'message': 'Instructors only'}), 403

    contents = LearningContent.query.filter_by(
        instructor_id=current_user['id']
    ).order_by(LearningContent.created_at.desc()).all()

    return jsonify({'content': [c.to_dict() for c in contents]}), 200