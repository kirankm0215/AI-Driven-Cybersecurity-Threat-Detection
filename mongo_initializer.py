from pymongo import MongoClient
from werkzeug.security import generate_password_hash
import datetime

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["cybersecurity"]

# Collections
users = db["users"]
alerts = db["alerts"]
tips = db["tips"]
otp = db["otp"]

# 1. Insert Default Admin User
admin_email = "admin@example.com"
if not users.find_one({"email": admin_email}):
    users.insert_one({
        "email": admin_email,
        "password": generate_password_hash("admin123"),
        "role": "admin"
    })

# 2. Insert Default Security Tips
default_tips = [
    {"title": "Use Strong Passwords", "tip": "Always use complex and unique passwords with a mix of letters, numbers, and symbols."},
    {"title": "Enable Two-Factor Authentication", "tip": "Use 2FA on all accounts that support it for better protection."},
    {"title": "Beware of Phishing Links", "tip": "Do not click suspicious links in emails or messages."},
    {"title": "Keep Software Updated", "tip": "Regularly update your OS, browser, and other software."},
    {"title": "Monitor Your Accounts", "tip": "Regularly review your bank and online accounts for unauthorized activity."}
]

for tip in default_tips:
    if not tips.find_one({"title": tip["title"]}):
        tips.insert_one(tip)

# 3. Insert Sample OTP Record (for testing)
sample_email = "testuser@example.com"
if not otp.find_one({"email": sample_email}):
    otp.insert_one({
        "email": sample_email,
        "otp": "123456",
        "created_at": datetime.datetime.utcnow()
    })

print("✅ MongoDB initialized with admin user, security tips, and test OTP entry.")
