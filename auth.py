from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from database import users_col
from datetime import timedelta
import logging
import re

auth_bp = Blueprint("auth", __name__)  # ✅ FIXED

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)  # ✅ FIXED

def is_valid_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'  # ✅ FIXED
    return re.match(pattern, email)

def is_strong_password(password):
    pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$'  # ✅ FIXED
    return re.match(pattern, password)

@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"msg": "Email and password are required"}), 400

        if not is_valid_email(email):
            return jsonify({"msg": "Invalid email format"}), 400

        if not is_strong_password(password):
            return jsonify({
                "msg": "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
            }), 400

        if users_col.find_one({"email": email}):
            return jsonify({"msg": "User already exists"}), 409

        hashed_password = generate_password_hash(password)
        users_col.insert_one({
            "email": email,
            "password": hashed_password,
            "role": "user"
        })

        logger.info(f"User registered: {email}")
        return jsonify({"msg": "Registered successfully"}), 201

    except Exception as e:
        logger.exception("Registration error:")
        return jsonify({"msg": "Internal server error"}), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"msg": "Email and password are required"}), 400

        user = users_col.find_one({"email": email})
        if not user or not check_password_hash(user["password"], password):
            return jsonify({"msg": "Invalid credentials"}), 401

        access_token = create_access_token(
            identity={"email": user["email"], "role": user["role"]},
            expires_delta=timedelta(hours=1)
        )

        logger.info(f"User logged in: {email}")
        return jsonify({"token": access_token, "role": user["role"]}), 200

    except Exception as e:
        logger.exception("Login error:")
        return jsonify({"msg": "Internal server error"}), 500
