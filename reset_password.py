from flask import Blueprint, request, jsonify
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash
import random
import datetime
from database import mongo

reset_password = Blueprint("reset_password", __name__)
mail = Mail()

@reset_password.route("/request-reset", methods=["POST"])
def request_reset():
    data = request.get_json()
    email = data["email"]
    otp = str(random.randint(100000, 999999))
    
    mongo.db.otps.insert_one({
        "email": email,
        "otp": otp,
        "created_at": datetime.datetime.utcnow()
    })

    msg = Message("Your OTP for Password Reset", sender="your_email@example.com", recipients=[email])
    msg.body = f"Your OTP is {otp}"
    mail.send(msg)

    return jsonify({"message": "OTP sent to your email."})

@reset_password.route("/verify-reset", methods=["POST"])
def verify_reset():
    data = request.get_json()
    email = data["email"]
    otp = data["otp"]
    new_password = data["new_password"]

    record = mongo.db.otps.find_one({"email": email, "otp": otp})
    if not record:
        return jsonify({"message": "Invalid or expired OTP"}), 400

    hashed = generate_password_hash(new_password)
    mongo.db.users.update_one({"email": email}, {"$set": {"password": hashed}})
    
    return jsonify({"message": "Password reset successful."})
