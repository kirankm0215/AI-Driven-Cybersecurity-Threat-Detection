from flask_pymongo import PyMongo
from flask import Flask

mongo_app = Flask(__name__)
mongo_app.config["MONGO_URI"] = "mongodb://localhost:27017/cybersecurity"
mongo = PyMongo(mongo_app)

users_col = mongo.db.users
alerts_col = mongo.db.alerts
tips_col = mongo.db.tips
otp_col = mongo.db.otp
