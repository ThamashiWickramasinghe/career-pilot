from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models.user import User
import bcrypt

auth_bp = Blueprint('auth', __name__)

# ── REGISTER ──────────────────────────────────────────
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check required fields
    required = ['full_name', 'email', 'password', 'role']
    for field in required:
        if field not in data or not data[field]:
            return jsonify({'message': f'{field} is required'}), 400
    
    # Check if email already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 409
    
    # Check valid role
    if data['role'] not in ['job_seeker', 'instructor']:
        return jsonify({'message': 'Invalid role'}), 400
    
    # Hash the password
    hashed = bcrypt.hashpw(
        data['password'].encode('utf-8'), 
        bcrypt.gensalt()
    ).decode('utf-8')
    
    # Create new user
    new_user = User(
        full_name=data['full_name'],
        email=data['email'],
        password=hashed,
        role=data['role']
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
    
    # Find user
    user = User.query.filter_by(email=data['email']).first()
    
    if not user:
        return jsonify({'message': 'Invalid email or password'}), 401
    
    # Check password
    if not bcrypt.checkpw(
        data['password'].encode('utf-8'), 
        user.password.encode('utf-8')
    ):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    if not user.is_active:
        return jsonify({'message': 'Account is deactivated'}), 403
    
    # Create JWT token
    token = create_access_token(identity={
        'id': user.id,
        'email': user.email,
        'role': user.role
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
    current_user = get_jwt_identity()
    user = User.query.get(current_user['id'])
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
        
    return jsonify({'user': user.to_dict()}), 200