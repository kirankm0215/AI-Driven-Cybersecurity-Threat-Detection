from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from database import tips_col

tips_bp = Blueprint("tips", __name__)

@tips_bp.route("/security-tips", methods=["GET"])
@jwt_required()
def get_tips():
    tips = list(tips_col.find({}, {"_id": 0}))
    return jsonify(tips)
