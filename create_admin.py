from werkzeug.security import generate_password_hash
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["cybersecurity"]
users = db["users"]

# Create proper hashed password
hashed_password = generate_password_hash("admin123")

# Insert admin user
users.insert_one({
    "email": "admin@example.com",
    "password": hashed_password,
    "role": "admin"
})

print("✅ Admin user created: admin@example.com / admin123")
