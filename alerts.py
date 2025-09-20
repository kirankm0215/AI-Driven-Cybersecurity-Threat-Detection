from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from database import alerts_col
import datetime

alerts_bp = Blueprint("alerts", __name__)

@alerts_bp.route("/log-alert", methods=["POST"])
@jwt_required()
def log_alert():
    data = request.json
    alert = {
        "message": data["message"],
        "type": data.get("type", "general"),
        "timestamp": datetime.datetime.utcnow()
    }
    alerts_col.insert_one(alert)
    return jsonify({"msg": "Alert logged successfully"}), 201

@alerts_bp.route("/alerts", methods=["GET"])
@jwt_required()
def get_alerts():
    alerts = list(alerts_col.find({}, {"_id": 0}))
    return jsonify(alerts), 200
