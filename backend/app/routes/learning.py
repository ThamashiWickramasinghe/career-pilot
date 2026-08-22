from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.learning import LearningContent, ContentAccess, ReAccessRequest, ContentComment
from app.models.user import User
from datetime import datetime, timedelta
import os
import json
from werkzeug.utils import secure_filename

learning_bp = Blueprint('learning', __name__)

UPLOAD_FOLDER = 'uploads/pdfs'
THUMBNAIL_FOLDER = 'uploads/thumbnails'
ALLOWED_PDF = {'pdf'}
ALLOWED_IMG = {'png', 'jpg', 'jpeg', 'webp'}

def allowed_file(filename, allowed):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed


def get_user_from_token():
    try:
        from flask_jwt_extended import get_jwt
        identity = get_jwt_identity()
        claims = get_jwt()
        user_id = claims.get('id') or identity
        user_role = claims.get('role')
        print(f"DEBUG identity: {identity}, claims: {claims}")
        return int(user_id), user_role
    except Exception as e:
        print(f"DEBUG error: {e}")
        return None, None


# ── INSTRUCTOR: POST CONTENT ──────────────────────────
@learning_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_content():
    user_id, user_role = get_user_from_token()
    print(f"DEBUG upload - user_id: {user_id}, user_role: {user_role}")

    if not user_id:
        return jsonify({'message': 'Invalid token - no user id'}), 422
    if user_role != 'instructor':
        return jsonify({'message': f'Instructors only. Your role: {user_role}'}), 403

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

    if 'thumbnail' in request.files:
        thumb = request.files['thumbnail']
        if thumb and allowed_file(thumb.filename, ALLOWED_IMG):
            filename = secure_filename(f"{datetime.utcnow().timestamp()}_{thumb.filename}")
            thumb.save(os.path.join(THUMBNAIL_FOLDER, filename))
            thumbnail_path = f"uploads/thumbnails/{filename}"

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
        instructor_id=user_id,
        is_approved=False
    )

    db.session.add(content)
    db.session.commit()

    return jsonify({
        'message': 'Content submitted for admin approval',
        'content': content.to_dict()
    }), 201


# ── GET ALL APPROVED CONTENT ──────────────────────────
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
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    content = LearningContent.query.get_or_404(content_id)

    if not content.is_approved and user_role == 'job_seeker':
        return jsonify({'message': 'Content not available'}), 403

    has_access = True
    access_info = None

    if user_role == 'job_seeker' and content.content_type == 'video_link':
        access = ContentAccess.query.filter_by(
            user_id=user_id,
            content_id=content_id,
            is_active=True
        ).first()

        if not access:
            new_access = ContentAccess(
                user_id=user_id,
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
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    data = request.get_json()
    if not data.get('comment'):
        return jsonify({'message': 'Comment is required'}), 400

    comment = ContentComment(
        content_id=content_id,
        user_id=user_id,
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
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    data = request.get_json()
    if not data.get('content_id'):
        return jsonify({'message': 'Content ID required'}), 400

    existing = ReAccessRequest.query.filter_by(
        user_id=user_id,
        content_id=data['content_id'],
        status='pending'
    ).first()

    if existing:
        return jsonify({'message': 'Request already pending'}), 409

    req = ReAccessRequest(
        user_id=user_id,
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
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422
    if user_role not in ['instructor', 'admin']:
        return jsonify({'message': 'Not authorized'}), 403

    requests = ReAccessRequest.query.filter_by(status='pending').all()
    return jsonify({'requests': [r.to_dict() for r in requests]}), 200


# ── INSTRUCTOR: RESPOND TO RE-ACCESS ─────────────────
@learning_bp.route('/reaccess/<int:request_id>/respond', methods=['POST'])
@jwt_required()
def respond_reaccess(request_id):
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422
    if user_role not in ['instructor', 'admin']:
        return jsonify({'message': 'Not authorized'}), 403

    data = request.get_json()
    action = data.get('action')

    if action not in ['approved', 'denied']:
        return jsonify({'message': 'Action must be approved or denied'}), 400

    req = ReAccessRequest.query.get_or_404(request_id)
    req.status = action
    req.responded_at = datetime.utcnow()

    if action == 'approved':
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
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422
    if user_role != 'admin':
        return jsonify({'message': 'Admins only'}), 403

    contents = LearningContent.query.filter_by(is_approved=False).all()
    return jsonify({'content': [c.to_dict() for c in contents]}), 200


# ── ADMIN: APPROVE/REJECT CONTENT ────────────────────
@learning_bp.route('/admin/content/<int:content_id>/review', methods=['POST'])
@jwt_required()
def review_content(content_id):
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422
    if user_role != 'admin':
        return jsonify({'message': 'Admins only'}), 403

    data = request.get_json()
    action = data.get('action')

    if action not in ['approve', 'reject']:
        return jsonify({'message': 'Action must be approve or reject'}), 400

    content = LearningContent.query.get_or_404(content_id)
    if action == 'approve':
        content.is_approved = True
        content.is_rejected = False
    else:
        content.is_approved = False
        content.is_rejected = True
    content.approved_by = user_id
    content.approved_at = datetime.utcnow()

    db.session.commit()
    return jsonify({'message': f'Content {action}d successfully'}), 200


# ── INSTRUCTOR: GET MY CONTENT ────────────────────────
@learning_bp.route('/my-content', methods=['GET'])
@jwt_required()
def get_my_content():
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422
    if user_role != 'instructor':
        return jsonify({'message': 'Instructors only'}), 403

    contents = LearningContent.query.filter_by(
        instructor_id=user_id
    ).order_by(LearningContent.created_at.desc()).all()

    return jsonify({'content': [c.to_dict() for c in contents]}), 200

# ── ADMIN: GET ALL CONTENT ────────────────────────────
@learning_bp.route('/admin/all', methods=['GET'])
@jwt_required()
def get_all_content_admin():
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422
    if user_role != 'admin':
        return jsonify({'message': 'Admins only'}), 403

    contents = LearningContent.query.order_by(
        LearningContent.created_at.desc()
    ).all()
    return jsonify({'content': [c.to_dict() for c in contents]}), 200

# ── GET COMMENTS FOR CONTENT (Instructor view) ────────
@learning_bp.route('/content/<int:content_id>/comments', methods=['GET'])
@jwt_required()
def get_content_comments(content_id):
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    comments = ContentComment.query.filter_by(content_id=content_id)\
        .order_by(ContentComment.created_at.desc()).all()

    return jsonify({'comments': [c.to_dict() for c in comments]}), 200

# ── INSTRUCTOR: UPDATE CONTENT ────────────────────────
@learning_bp.route('/content/<int:content_id>', methods=['PUT'])
@jwt_required()
def update_content(content_id):
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422
    if user_role != 'instructor':
        return jsonify({'message': 'Instructors only'}), 403

    content = LearningContent.query.get_or_404(content_id)

    if content.instructor_id != user_id:
        return jsonify({'message': 'Not authorized'}), 403

    data = request.get_json()
    content.title = data.get('title', content.title)
    content.description = data.get('description', content.description)
    content.category = data.get('category', content.category)
    content.drive_link = data.get('drive_link', content.drive_link)
    content.is_approved = False

    db.session.commit()
    return jsonify({
        'message': 'Content updated successfully',
        'content': content.to_dict()
    }), 200


# ── INSTRUCTOR: DELETE CONTENT ────────────────────────
@learning_bp.route('/content/<int:content_id>', methods=['DELETE'])
@jwt_required()
def delete_content(content_id):
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422
    if user_role != 'instructor':
        return jsonify({'message': 'Instructors only'}), 403

    content = LearningContent.query.get_or_404(content_id)

    if content.instructor_id != user_id:
        return jsonify({'message': 'Not authorized'}), 403

    db.session.delete(content)
    db.session.commit()
    return jsonify({'message': 'Content deleted successfully'}), 200


# ── JOB SEEKER: GET MY COURSES (active + requested) ──────────
# Powers the Dashboard "My Courses" card with real data instead
# of a hardcoded list. Active = live ContentAccess rows.
# Requested = pending ReAccessRequest rows.
@learning_bp.route('/my-courses', methods=['GET'])
@jwt_required()
def get_my_courses():
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    active_access = ContentAccess.query.filter_by(
        user_id=user_id, is_active=True
    ).order_by(ContentAccess.granted_at.desc()).all()

    active_courses = []
    for a in active_access:
        if a.content:
            item = a.content.to_dict()
            item['access'] = a.to_dict()
            active_courses.append(item)

    pending_requests = ReAccessRequest.query.filter_by(
        user_id=user_id, status='pending'
    ).order_by(ReAccessRequest.requested_at.desc()).all()

    requested_courses = []
    for r in pending_requests:
        if r.content:
            item = r.content.to_dict()
            item['request'] = r.to_dict()
            requested_courses.append(item)

    return jsonify({
        'active_courses': active_courses,
        'requested_courses': requested_courses
    }), 200


# ── JOB SEEKER: GET NOTIFICATIONS (re-access decisions) ──────
# When an instructor approves/denies a re-access request, this
# shows up here so it can be surfaced in the notification bell.
@learning_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_learning_notifications():
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422

    responded = ReAccessRequest.query.filter(
        ReAccessRequest.user_id == user_id,
        ReAccessRequest.status != 'pending'
    ).order_by(ReAccessRequest.responded_at.desc()).limit(10).all()

    notifications = []
    for r in responded:
        title = r.content.title if r.content else 'your course'

        if r.status == 'approved':
            text = f'Your re-access request for "{title}" was approved'
        else:
            text = f'Your re-access request for "{title}" was denied'

        notifications.append({
            'id': f'reaccess-{r.id}',
            'text': text,
            'time': str(r.responded_at) if r.responded_at else str(r.requested_at),
            'unread': True,
            'type': 'reaccess',
            'status': r.status,
            'content_id': r.content_id
        })

    return jsonify({'notifications': notifications}), 200


# ── INSTRUCTOR: ANALYTICS ─────────────────────────────
# Powers the Analytics page: content mix, category spread,
# a 6-month upload trend, students reached, comment volume,
# top-performing content, and re-access response stats — all
# computed live from this instructor's own content.
@learning_bp.route('/analytics', methods=['GET'])
@jwt_required()
def get_instructor_analytics():
    user_id, user_role = get_user_from_token()
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 422
    if user_role != 'instructor':
        return jsonify({'message': 'Instructors only'}), 403

    contents = LearningContent.query.filter_by(instructor_id=user_id).all()
    content_ids = [c.id for c in contents]

    total_content = len(contents)
    approved_count = sum(1 for c in contents if c.is_approved)
    rejected_count = sum(1 for c in contents if c.is_rejected)
    pending_count = total_content - approved_count - rejected_count

    # Content type breakdown (video_link / pdf / note)
    type_counts = {}
    for c in contents:
        type_counts[c.content_type] = type_counts.get(c.content_type, 0) + 1
    content_type_breakdown = [
        {'type': k, 'count': v} for k, v in type_counts.items()
    ]

    # Category breakdown, sorted highest first
    category_counts = {}
    for c in contents:
        cat = c.category or 'Uncategorized'
        category_counts[cat] = category_counts.get(cat, 0) + 1
    category_breakdown = sorted(
        [{'category': k, 'count': v} for k, v in category_counts.items()],
        key=lambda x: -x['count']
    )

    # Uploads over the last 6 months (including current month)
    now = datetime.utcnow()
    month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    month_buckets = []
    y, m = now.year, now.month
    for i in range(5, -1, -1):
        mm, yy = m - i, y
        while mm <= 0:
            mm += 12
            yy -= 1
        month_buckets.append((yy, mm))

    monthly_counts = {f'{yy}-{mm:02d}': 0 for yy, mm in month_buckets}
    for c in contents:
        if c.created_at:
            key = c.created_at.strftime('%Y-%m')
            if key in monthly_counts:
                monthly_counts[key] += 1

    monthly_uploads = [
        {'month': month_names[mm - 1], 'count': monthly_counts[f'{yy}-{mm:02d}']}
        for yy, mm in month_buckets
    ]

    # Distinct students who have ever had access to this instructor's content
    students_reached = 0
    if content_ids:
        students_reached = db.session.query(ContentAccess.user_id).filter(
            ContentAccess.content_id.in_(content_ids)
        ).distinct().count()

    # Total comments received across all of this instructor's content
    total_comments = 0
    if content_ids:
        total_comments = ContentComment.query.filter(
            ContentComment.content_id.in_(content_ids)
        ).count()

    # Top 5 content items by number of students with access
    top_content = []
    if content_ids:
        access_counts = db.session.query(
            ContentAccess.content_id, db.func.count(ContentAccess.id)
        ).filter(
            ContentAccess.content_id.in_(content_ids)
        ).group_by(ContentAccess.content_id).all()
        access_map = {cid: cnt for cid, cnt in access_counts}

        for c in contents:
            top_content.append({
                'id': c.id,
                'title': c.title,
                'content_type': c.content_type,
                'category': c.category,
                'students': access_map.get(c.id, 0),
                'is_approved': c.is_approved,
                'is_rejected': c.is_rejected
            })
        top_content.sort(key=lambda x: -x['students'])
        top_content = top_content[:5]

    # Re-access request outcomes for this instructor's content
    reaccess_approved = reaccess_denied = reaccess_pending = 0
    if content_ids:
        reaccess_approved = ReAccessRequest.query.filter(
            ReAccessRequest.content_id.in_(content_ids),
            ReAccessRequest.status == 'approved'
        ).count()
        reaccess_denied = ReAccessRequest.query.filter(
            ReAccessRequest.content_id.in_(content_ids),
            ReAccessRequest.status == 'denied'
        ).count()
        reaccess_pending = ReAccessRequest.query.filter(
            ReAccessRequest.content_id.in_(content_ids),
            ReAccessRequest.status == 'pending'
        ).count()

    return jsonify({
        'total_content': total_content,
        'approved_count': approved_count,
        'pending_count': pending_count,
        'rejected_count': rejected_count,
        'content_type_breakdown': content_type_breakdown,
        'category_breakdown': category_breakdown,
        'monthly_uploads': monthly_uploads,
        'students_reached': students_reached,
        'total_comments': total_comments,
        'top_content': top_content,
        'reaccess_stats': {
            'approved': reaccess_approved,
            'denied': reaccess_denied,
            'pending': reaccess_pending
        }
    }), 200
