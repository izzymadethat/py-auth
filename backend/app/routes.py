from app.database import db
from app.user import User
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

api = Blueprint("api", __name__)

# Signup a user
# /api/register
@api.route("/register", methods=["POST"])
def register():
    # get the data from the request body
    data = request.get_json()
    # specifically get the email and password
    email = data.get("email")
    password = data.get("password")
    
    # Check if user exists already
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 400
    
    # Hash the password and create the user
    user = User(email=email, password=generate_password_hash(password))
    
    # add user to database and or rollback
    try:
        db.session.add(user)
        db.session.commit()
        return jsonify(user.to_json()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
# Login a user
# /api/login
@api.route("/login", methods=["POST"])
def login():
    # Get the data from the request body
    data = request.get_json()
    # specifically get the email and password
    email = data.get("email")
    password = data.get("password")

    # Find the user by email
    user = User.query.filter_by(email=email).first()
    
    # error if user doesn't exist or if the password is incorrect
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401
    
    return jsonify(user.to_json()), 200
