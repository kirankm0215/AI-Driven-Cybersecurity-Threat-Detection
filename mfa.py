from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from database import otp_col
import random, datetime

mfa_bp = Blueprint("mfa", __name__)

@mfa_bp.route("/mfa/send-otp", methods=["POST"])
@jwt_required()
def send_otp():
    data = request.json
    email = data["email"]
    otp = str(random.randint(100000, 999999))
    
    # Store OTP in DB
    otp_col.insert_one({
        "email": email,
        "otp": otp,
        "created_at": datetime.datetime.utcnow()
    })
    
    print(f"[DEBUG] OTP for {email}: {otp}")  # Simulate sending email
    return jsonify({"msg": "OTP sent to email"}), 200

@mfa_bp.route("/mfa/verify-otp", methods=["POST"])
@jwt_required()
def verify_otp():
    data = request.json
    record = otp_col.find_one({
        "email": data["email"],
        "otp": data["otp"]
    })

    if record:
        return jsonify({"msg": "OTP Verified"}), 200
    return jsonify({"msg": "Invalid OTP"}), 400
