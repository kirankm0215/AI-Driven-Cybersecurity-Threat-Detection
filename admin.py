from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import mongo

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/admin/stats", methods=["GET"])
@jwt_required()
def admin_stats():
    identity = get_jwt_identity()
    if identity["role"] != "admin":
        return jsonify({"error": "Forbidden"}), 403

    total_users = mongo.db.users.count_documents({})
    total_alerts = mongo.db.alerts.count_documents({})
    return jsonify({
        "total_users": total_users,
        "total_alerts": total_alerts
    })
