from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db, mail
from app.models.user import User
import bcrypt
import secrets
from datetime import datetime, timedelta
from flask_mail import Message
 
auth_bp = Blueprint('auth', __name__)
 
# ── REGISTER ──────────────────────────────────────────
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
 
    required = ['full_name', 'username', 'email', 'password', 
                 'confirm_password', 'role']
    for field in required:
        if field not in data or not data[field]:
            return jsonify({'message': f'{field} is required'}), 400
 
    if data['password'] != data['confirm_password']:
        return jsonify({'message': 'Passwords do not match'}), 400
 
    if len(data['password']) < 6:
        return jsonify({'message': 'Password must be at least 6 characters'}), 400
 
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 409
 
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already taken'}), 409
 
    if data['role'] not in ['job_seeker', 'instructor', 'company']:
        return jsonify({'message': 'Invalid role'}), 400
 
    hashed = bcrypt.hashpw(
        data['password'].encode('utf-8'),
        bcrypt.gensalt()
    ).decode('utf-8')
 
    new_user = User(
        full_name=data['full_name'],
        username=data['username'],
        email=data['email'],
        password=hashed,
        role=data['role'],
        current_post=data.get('current_post', None),
        company_name=data.get('company_name', None)
    )
 
    db.session.add(new_user)
    db.session.commit()
 
    return jsonify({
        'message': 'Registration successful',
        'user': new_user.to_dict()
    }), 201
 
 
# ── LOGIN ─────────────────────────────────────────────
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
 
    if not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password required'}), 400
 
    user = User.query.filter_by(email=data['email']).first()
 
    if not user:
        return jsonify({'message': 'Invalid email or password'}), 401
 
    if not bcrypt.checkpw(
        data['password'].encode('utf-8'),
        user.password.encode('utf-8')
    ):
        return jsonify({'message': 'Invalid email or password'}), 401
 
    if not user.is_active:
        return jsonify({'message': 'Account is deactivated'}), 403
 
    token = create_access_token(identity=str(user.id), additional_claims={
        'email': user.email,
        'role': user.role,
        'id': user.id
    })
 
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': user.to_dict()
    }), 200
 
 
# ── GET CURRENT USER ──────────────────────────────────
@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    from flask_jwt_extended import get_jwt
    claims = get_jwt()
    user = User.query.get(claims.get('id'))
    if not user:
        return jsonify({'message': 'User not found'}), 404
    return jsonify({'user': user.to_dict()}), 200
 
 
# ── FORGOT PASSWORD ───────────────────────────────────
@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
 
    if not data.get('email'):
        return jsonify({'message': 'Email is required'}), 400
 
    user = User.query.filter_by(email=data['email']).first()
 
    # Always return success even if email not found (security best practice)
    if not user:
        return jsonify({'message': 'If this email exists, a reset link has been sent'}), 200
 
    # Generate secure token
    token = secrets.token_urlsafe(32)
    user.reset_token = token
    user.reset_token_expiry = datetime.utcnow() + timedelta(hours=1)
    db.session.commit()
 
    # Send email
    reset_link = f"http://localhost:5173/reset-password/{token}"
    try:
        msg = Message(
            subject='Career Pilot - Password Reset Request',
            sender='noreply@careerpilot.com',
            recipients=[user.email]
        )
        msg.body = f"""
Hello {user.full_name},
 
You requested a password reset for your Career Pilot account.
 
Click the link below to reset your password (valid for 1 hour):
{reset_link}
 
If you did not request this, please ignore this email.
 
Career Pilot Team
        """
        mail.send(msg)
    except Exception as e:
        return jsonify({'message': 'Failed to send email. Check mail settings.'}), 500
 
    return jsonify({'message': 'Password reset link sent to your email'}), 200
 
 
# ── RESET PASSWORD ────────────────────────────────────
@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
 
    if not data.get('token') or not data.get('password'):
        return jsonify({'message': 'Token and password are required'}), 400
 
    if data['password'] != data.get('confirm_password'):
        return jsonify({'message': 'Passwords do not match'}), 400
 
    user = User.query.filter_by(reset_token=data['token']).first()
 
    if not user:
        return jsonify({'message': 'Invalid or expired reset link'}), 400
 
    if datetime.utcnow() > user.reset_token_expiry:
        return jsonify({'message': 'Reset link has expired'}), 400
 
    hashed = bcrypt.hashpw(
        data['password'].encode('utf-8'),
        bcrypt.gensalt()
    ).decode('utf-8')
 
    user.password = hashed
    user.reset_token = None
    user.reset_token_expiry = None
    db.session.commit()
 
    return jsonify({'message': 'Password reset successful'}), 200
 
 
# ── GET PROFILE ───────────────────────────────────────
@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        from flask_jwt_extended import get_jwt
        claims = get_jwt()
        user_id = claims.get('id')
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        return jsonify({'user': user.to_dict()}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
 
 
# ── UPDATE PROFILE ────────────────────────────────────
@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        from flask_jwt_extended import get_jwt
        claims = get_jwt()
        user_id = claims.get('id')
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
 
        data = request.get_json()
        user.full_name = data.get('full_name', user.full_name)
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.current_post = data.get('current_post', user.current_post)
        user.skills = data.get('skills', user.skills)
        user.bio = data.get('bio', user.bio)
        user.experience_years = data.get('experience_years', user.experience_years)
        user.github = data.get('github', user.github)
        user.linkedin = data.get('linkedin', user.linkedin)
        user.portfolio = data.get('portfolio', user.portfolio)
 
        db.session.commit()
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


# ── ADMIN: GET ALL USERS ──────────────────────────────
# Powers the Admin Dashboard's "Total Users" stat card, the
# User Roles chart, User Growth chart, Recent Users list, and
# the Manage Users table — all computed live from this list.
@auth_bp.route('/admin/users', methods=['GET'])
@jwt_required()
def admin_get_all_users():
    try:
        from flask_jwt_extended import get_jwt
        claims = get_jwt()
        if claims.get('role') != 'admin':
            return jsonify({'message': 'Admins only'}), 403

        users = User.query.order_by(User.created_at.desc()).all()
        return jsonify({'users': [u.to_dict() for u in users]}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


# ── ADMIN: ACTIVATE / DEACTIVATE USER ─────────────────
@auth_bp.route('/admin/users/<int:user_id>/status', methods=['PUT'])
@jwt_required()
def admin_update_user_status(user_id):
    try:
        from flask_jwt_extended import get_jwt
        claims = get_jwt()
        if claims.get('role') != 'admin':
            return jsonify({'message': 'Admins only'}), 403

        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404

        data = request.get_json() or {}
        if 'is_active' in data:
            user.is_active = bool(data['is_active'])
        else:
            user.is_active = not user.is_active

        db.session.commit()
        return jsonify({
            'message': f'User {"activated" if user.is_active else "deactivated"} successfully',
            'user': user.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


# ── ADMIN: REMOVE USER ────────────────────────────────
@auth_bp.route('/admin/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_user(user_id):
    try:
        from flask_jwt_extended import get_jwt
        claims = get_jwt()
        if claims.get('role') != 'admin':
            return jsonify({'message': 'Admins only'}), 403

        if claims.get('id') == user_id:
            return jsonify({'message': 'You cannot remove your own account'}), 400

        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404

        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User removed successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'message': 'Failed to remove user. They may still own content, jobs, or applications that reference their account.'
        }), 500
