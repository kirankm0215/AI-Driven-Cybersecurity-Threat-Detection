from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
from chatbot_local import get_bot_reply
from datetime import datetime
import joblib
import random
import re
import numpy as np
import requests
from urllib.parse import urlparse
import re
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
from flask_jwt_extended import JWTManager
import requests
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import timedelta
import time
import subprocess
from werkzeug.security import check_password_hash
import os
from urllib.parse import urlencode
from dotenv import load_dotenv
from flask import Flask, request, jsonify, redirect
from flask import session
import uuid
import secrets
from urllib.parse import urlencode

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = "your_secret_key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

jwt = JWTManager(app)

def extract_features_from_url(url):
    parsed = urlparse(url)

    features = []

    # --- 1 to 30 features ---
    features.append(url.count('.'))  # 1
    features.append(url.count('-'))  # 2
    features.append(url.count('_'))  # 3
    features.append(url.count('/'))  # 4
    features.append(url.count('?'))  # 5
    features.append(url.count('='))  # 6
    features.append(url.count('@'))  # 7
    features.append(url.count('&'))  # 8
    features.append(url.count('!'))  # 9
    features.append(url.count(' '))  # 10
    features.append(url.count('~'))  # 11
    features.append(url.count(','))  # 12
    features.append(url.count('+'))  # 13
    features.append(url.count('*'))  # 14
    features.append(url.count('#'))  # 15
    features.append(url.count('$'))  # 16
    features.append(url.count('%'))  # 17

    features.append(len(url))  # 18
    features.append(len(parsed.netloc))  # 19
    features.append(len(parsed.path))  # 20
    features.append(len(parsed.query))  # 21
    features.append(parsed.netloc.count('.'))  # 22
    features.append(parsed.path.count('/'))  # 23
    features.append(parsed.path.count('-'))  # 24
    features.append(parsed.path.count('_'))  # 25
    features.append(int(parsed.scheme == 'https'))  # 26
    features.append(int("login" in url.lower()))  # 27
    features.append(int("secure" in url.lower()))  # 28
    features.append(int("verify" in url.lower()))  # 29
    features.append(int("bank" in url.lower()))  # 30

    return features

# ───── CONFIG ─────
app.config["MONGO_URI"] = "mongodb://localhost:27017/cybersecurity"
app.config["JWT_SECRET_KEY"] = "your_secret_key"
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USERNAME"] = "kirankm1711@gmail.com"  # ✅ your Gmail address
app.config["MAIL_PASSWORD"] = "wihwmnqqgrfzymgl"        # ✅ app-specific password
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USE_SSL"] = False
GOOGLE_CLIENT_ID = "1039261332404-5agk2s6c1knscudslni56etnsn66hgtd.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "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"
GITHUB_CLIENT_ID = "Ov23liy4L79bXky7ezze"
GITHUB_CLIENT_SECRET = "59961500097e9ce29fa1a246f9a662423f1a48aa"
FRONTEND_REDIRECT_URL = "http://localhost:3000/oauth-success"

REDIRECT_URI_GOOGLE = "http://localhost:5000/auth/google/callback"
REDIRECT_URI_GITHUB = "http://localhost:5000/auth/github/callback"

mongo = PyMongo(app)
jwt = JWTManager(app)
mail = Mail(app)

# ───── ML Models ─────
phishing_model = joblib.load("phishing_model.pkl")
upi_fraud_model = joblib.load("upi_fraud_model.pkl")

# ───── EMAIL FUNCTION ─────
def send_otp_email(email, otp):
    try:
        msg = Message(
            subject="Your OTP Code",
            sender=app.config["MAIL_USERNAME"],
            recipients=[email],
            body=f"Your OTP is: {otp}"
        )
        mail.send(msg)
        print(f"✅ OTP sent to {email}")
    except Exception as e:
        print("❌ Failed to send OTP email:", str(e))


# ───── REGISTER ─────
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data['email']
    password = generate_password_hash(data['password'])
    role = data.get('role', 'user')
    
    if mongo.db.users.find_one({"email": email}):
        return jsonify({"message": "Email already registered"}), 400

    otp = str(random.randint(100000, 999999))
    mongo.db.pending_users.insert_one({
        "email": email,
        "password": password,
        "otp": otp,
        "role": role
    })

    send_otp_email(email, otp)
    return jsonify({"message": "OTP sent"}), 200


@app.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.get_json()
    email = data.get("email")
    otp = data.get("otp")

    user = mongo.db.pending_users.find_one({"email": email, "otp": otp})
    if not user:
        return jsonify({"success": False, "message": "Invalid email or OTP"}), 400

    mongo.db.users.insert_one({
        "email": user["email"],
        "password": user["password"],
        "role": user["role"],
        "is_verified": True
    })
    mongo.db.pending_users.delete_one({"_id": user["_id"]})
    return jsonify({"success": True, "message": "OTP verified"}), 200

# ───── GOOGLE LOGIN ─────

@app.route("/auth/google/login")
def google_login():
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": REDIRECT_URI_GOOGLE,  # e.g. http://localhost:5000/auth/google/callback
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
        "state": str(uuid.uuid4())  # security check
    }

    google_url = "https://accounts.google.com/o/oauth2/v2/auth?" + urlencode(params)
    print("🔗 Google Auth URL:", google_url)

    # Save state in session to verify later
    session["google_oauth_state"] = params["state"]

    return redirect(google_url)

@app.route("/auth/google/callback")
def google_callback():
    code = request.args.get("code")
    state = request.args.get("state")

    # ✅ Validate state to prevent CSRF
    if not code or not state or state != session.get("google_oauth_state"):
        return jsonify({"error": "Missing or invalid authorization code/state"}), 400

    # Exchange code for token
    token_res = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": REDIRECT_URI_GOOGLE,
            "grant_type": "authorization_code",
        },
    )

    token_data = token_res.json()
    access_token = token_data.get("access_token")

    if not access_token:
        return jsonify({"error": "Failed to get Google token", "details": token_data}), 400

    # Fetch user info
    userinfo = requests.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        params={"access_token": access_token},
    ).json()

    email = userinfo.get("email")
    if not email:
        return jsonify({"error": "Failed to get user info"}), 400

    # Find or create user in DB
    user = mongo.db.users.find_one({"email": email})
    if not user:
        mongo.db.users.insert_one({
            "email": email,
            "password": "",
            "role": "user",
            "is_verified": True,
        })

    # Create JWT token
    jwt_token = create_access_token(identity=email)

    # ✅ Redirect to React app with token
    return redirect(f"{FRONTEND_REDIRECT_URL}?token={jwt_token}")


# ───── GITHUB LOGIN ─────
@app.route("/")
def home():
    return '''
        <h2>Welcome to My App</h2>
        <a href="/auth/github/login">Login with GitHub</a>
    '''

# Step 1: Redirect to GitHub for login
@app.route("/auth/github/login")
def github_login():
    state = secrets.token_hex(16)
    session["oauth_state"] = state

    github_authorize_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={GITHUB_CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI_GITHUB}"
        f"&scope=read:user user:email"
        f"&state={state}"
    )

    print("🔗 Redirecting to:", github_authorize_url)  # ✅ Add this

    return redirect(github_authorize_url)


# Step 2: GitHub redirects here after login
@app.route("/auth/github/callback")
def github_callback():
    code = request.args.get("code")
    state = request.args.get("state")

    if not code or not state:
        return jsonify({"error": "Missing authorization code or state"}), 400

    if state != session.get("oauth_state"):
        return jsonify({"error": "Invalid state parameter"}), 403

    # Step 3: Exchange code for access token
    token_url = "https://github.com/login/oauth/access_token"
    token_headers = {"Accept": "application/json"}
    token_data = {
        "client_id": GITHUB_CLIENT_ID,
        "client_secret": GITHUB_CLIENT_SECRET,
        "code": code,
        "redirect_uri": REDIRECT_URI_GITHUB,
        "state": state
    }

    token_response = requests.post(token_url, headers=token_headers, data=token_data)
    token_json = token_response.json()

    if "error" in token_json:
        return jsonify({"error": token_json}), 400

    access_token = token_json.get("access_token")

    # Step 4: Use access token to get user info
    user_api_url = "https://api.github.com/user"
    user_headers = {"Authorization": f"token {access_token}"}
    user_response = requests.get(user_api_url, headers=user_headers)

    if user_response.status_code != 200:
        return jsonify({"error": "Failed to fetch GitHub user info"}), 500

    user_data = user_response.json()

    return jsonify({
        "message": "GitHub login successful!",
        "user": {
            "login": user_data.get("login"),
            "name": user_data.get("name"),
            "email": user_data.get("email"),
            "avatar_url": user_data.get("avatar_url")
        }
    })



# ───── LOGIN ─────
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data["email"]
    password = data["password"]

    user = mongo.db.users.find_one({"email": email})
    if not user or not check_password_hash(user["password"], password):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=email)
    return jsonify({"token": access_token, "role": user["role"]}), 200



# ───── MFA ─────
@app.route("/mfa/setup", methods=["POST"])
@jwt_required()
def setup_mfa():
    user = get_jwt_identity()
    mongo.db.users.update_one({"email": user["email"]}, {"$set": {"mfa_enabled": True}})
    return jsonify({"message": "MFA enabled"})


# ───── PASSWORD RESET ─────
@app.route("/request-reset", methods=["POST"])
def request_reset():
    data = request.json
    otp = str(random.randint(100000, 999999))
    mongo.db.otps.insert_one({
        "email": data["email"],
        "otp": otp,
        "created_at": datetime.utcnow()
    })
    msg = Message("Password Reset OTP", sender=app.config["MAIL_USERNAME"], recipients=[data["email"]])
    msg.body = f"Your OTP is {otp}"
    mail.send(msg)
    return jsonify({"message": "OTP sent to email"})


@app.route("/verify-reset", methods=["POST"])
def verify_reset():
    data = request.json
    record = mongo.db.otps.find_one({"email": data["email"], "otp": data["otp"]})
    if not record:
        return jsonify({"message": "Invalid OTP"}), 400

    hashed = generate_password_hash(data["new_password"])
    mongo.db.users.update_one({"email": data["email"]}, {"$set": {"password": hashed}})
    return jsonify({"message": "Password reset successful"})


# ───── PHISHING DETECTION ─────
@app.route("/check-phishing", methods=["POST"])
def check_phishing():
    data = request.get_json()
    url = data.get("url")

    if not url:
        return jsonify({"error": "Missing URL"}), 400

    try:
        features = extract_features_from_url(url)  # ✅ Use correct function
        print("✅ URL:", url)
        print("🔍 Extracted Features:", features)

        prediction = phishing_model.predict([features])[0]
        return jsonify({
            "is_phishing": bool(prediction),
            "message": "🚨 Warning ⚠️ Phishing detected" if prediction else "✅ Safe URL"
        })
    except Exception as e:
        print("❌ Error during prediction:", str(e))
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500




# ───── TRUSTED HANDLES FOR RULE-BASED CHECK ─────
TRUSTED_HANDLES = {
    "okhdfcbank", "oksbi", "okaxis", "okicici", "paytm", "upi", "ybl", "apl", "airtel", "jio", "ibl", "idfc"
}

# ───── RULE-BASED UPI SAFETY CHECK ─────
# ✅ Trusted UPI handles (you can expand this as needed)
TRUSTED_HANDLES = {
    "ybl", "ibl", "axl", "upi", "paytm", "okhdfcbank", "oksbi", "okaxis",
    "okicici", "oksbi", "okpaytm", "kotak", "airtel", "yesbank", "fam",
    "mahb", "fbl", "barodampay", "uboi", "jsb", "cub", "idfcbank"
}

@app.route("/check-upi", methods=["POST"])
def check_upi():
    data = request.get_json()
    upi_id = data.get("upi_id", "").strip().lower()

    # 🧪 Logging input for debugging
    print("Received UPI ID:", upi_id)

    if not upi_id or "@" not in upi_id:
        return jsonify({"result": "Invalid UPI ID", "safe": False})

    # ✅ Basic format check
    if not re.match(r'^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{3,}$', upi_id):
        return jsonify({"result": "Invalid UPI ID format", "safe": False})

    # 🔍 Split username and handle
    username, handle = upi_id.split("@", 1)
    print("Username:", username)
    print("Handle:", handle)

    # ✅ Rule 1: Trusted handle check
    if handle not in TRUSTED_HANDLES:
        print("❌ Untrusted handle")
        return jsonify({
            "result": f"Suspicious UPI domain: {handle} not recognized",
            "safe": False
        })

    # ⚠️ Rule 2: Suspicious keywords
    suspicious_keywords = ["lottery", "winner", "claim", "refund", "gov", "prize", "support", "helpdesk", "alert"]
    if any(keyword in username for keyword in suspicious_keywords):
        print("❌ Suspicious keyword found")
        return jsonify({
            "result": "UPI ID contains suspicious keywords",
            "safe": False
        })

    # ❗ Rule 3: Randomness / Too many digits
    if len(re.findall(r"\d", username)) > 6 or len(username) < 3:
        print("❌ Username has too many digits or is too short")
        return jsonify({
            "result": "UPI ID may be randomly generated",
            "safe": False
        })

    # ✅ If all checks passed
    print("✅ UPI ID appears safe")
    return jsonify({
        "result": "✅ UPI ID appears safe",
        "safe": True
    })


# ───── ML-BASED UPI FRAUD DETECTION ─────
@app.route("/detect-upi-fraud", methods=["POST"])
@jwt_required()
def detect_upi_fraud():
    print("✅ Received UPI fraud request")

    try:
        user_identity = get_jwt_identity()
        print("🔐 JWT identity:", user_identity)
    except Exception as e:
        print("❌ JWT error:", str(e))
        return jsonify({"message": "Token invalid or expired"}), 401

    data = request.get_json()
    upi_id = data.get("upi_id")
    amount = data.get("amount")
    date = data.get("date")

    if not upi_id or amount is None or not date:
        return jsonify({"message": "upi_id, amount, and date are required"}), 400

    try:
        # Extract features
        upi_len = len(upi_id)
        num_dots = len(re.findall(r"\.", upi_id))
        amount = float(amount)
        dt = datetime.fromisoformat(date)
        hour_of_day = dt.hour

        features = [upi_len, num_dots, amount, hour_of_day]
        prediction = upi_fraud_model.predict([features])
        is_fraud = bool(prediction[0])

        # Log in alerts collection
        mongo.db.alerts.insert_one({
            "message": f"Checked UPI ID: {upi_id} - Fraud: {is_fraud}",
            "timestamp": datetime.utcnow(),
            "user": user_identity
        })

        return jsonify({
            "is_fraud": is_fraud,
            "message": "✅ This UPI ID is SAFE." if not is_fraud else "🚨 Warning ⚠️ This UPI ID is NOT SAFE!"
        })

    except Exception as e:
        print("❌ Exception in prediction:", str(e))
        return jsonify({"message": "Server error", "error": str(e)}), 500
# ───── ALERTS ─────
@app.route("/alerts", methods=["GET"])
@jwt_required()
def get_alerts():
    alerts = list(mongo.db.alerts.find({}, {"_id": 0}))
    return jsonify(alerts)


# ───── AI CHATBOT (Local Ollama) ─────
# ✅ STEP 1: Preload the model
def preload_model():
    try:
        # Starts the model in background using `ollama run llama3`
        subprocess.Popen(["ollama", "run", "llama3"])
        print("🔄 Loading llama3 model...")
        # Optional: Wait a few seconds to ensure it's loaded
        time.sleep(10)
    except Exception as e:
        print(f"❌ Error preloading model: {e}")

preload_model()

# ✅ STEP 2: Your existing route
@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    prompt = data.get('prompt', '')

    if not prompt:
        return jsonify({"response": "Prompt is empty."}), 400

    ollama_url = "http://localhost:11434/api/generate"
    payload = {
        "model": "llama3",
        "prompt": prompt,
        "stream": False
    }

    try:
        response = requests.post(ollama_url, json=payload)
        result = response.json()

        if result.get("response"):
            return jsonify({"response": result["response"]})
        else:
            return jsonify({"response": "⚠️ Model is still loading, please try again."}), 503

    except Exception as e:
        return jsonify({"error": str(e)}), 500



# ───── CHAT HISTORY ─────
@app.route("/api/chat/history", methods=["GET"])
@jwt_required()
def chat_history():
    user = get_jwt_identity()
    history = list(mongo.db.chat_history.find({"email": user}))
    for item in history:
        item["_id"] = str(item["_id"])
    return jsonify(history)


# ───── TIPS ─────
@app.route("/add-sample-tips", methods=["GET"])
def add_sample_tips():
    tips = [
        {"message": "Use strong, unique passwords for each account."},
        {"message": "Enable two-factor authentication (2FA) wherever possible."},
        {"message": "Do not click on suspicious links or attachments in emails."},
        {"message": "Keep your software and operating systems updated."},
        {"message": "Always verify the sender before sharing sensitive data."},
    ]
    mongo.db.tips.insert_many(tips)
    return jsonify({"message": "Sample tips added."})


# ───── MAIN ─────
if __name__ == "__main__":
    app.run(debug=True)
