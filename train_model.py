import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# -----------------------------
# ✅ Phishing Detection Model
# -----------------------------
phishing_data = {
    "has_ip": [1, 0, 1, 0, 1],
    "has_at_symbol": [0, 1, 1, 0, 1],
    "url_length": [70, 120, 50, 90, 130],
    "label": [1, 0, 1, 0, 1]
}

phishing_df = pd.DataFrame(phishing_data)

X_phish = phishing_df.drop("label", axis=1)
y_phish = phishing_df["label"]

X_train_p, X_test_p, y_train_p, y_test_p = train_test_split(X_phish, y_phish, test_size=0.2)

phishing_model = RandomForestClassifier()
phishing_model.fit(X_train_p, y_train_p)

joblib.dump(phishing_model, "phishing_model.pkl")
print("✅ Phishing model saved as phishing_model.pkl")

# -----------------------------
# ✅ UPI Fraud Detection Model
# -----------------------------
# Example features: amount, transaction_hour, is_new_beneficiary, label
upi_data = {
    "amount": [5000, 150, 25000, 75, 9000],
    "transaction_hour": [2, 13, 1, 16, 23],
    "is_new_beneficiary": [1, 0, 1, 0, 1],
    "label": [1, 0, 1, 0, 1]  # 1 = fraud, 0 = normal
}

upi_df = pd.DataFrame(upi_data)

X_upi = upi_df.drop("label", axis=1)
y_upi = upi_df["label"]

X_train_u, X_test_u, y_train_u, y_test_u = train_test_split(X_upi, y_upi, test_size=0.2)

upi_model = RandomForestClassifier()
upi_model.fit(X_train_u, y_train_u)

joblib.dump(upi_model, "upi_fraud_model.pkl")
print("✅ UPI fraud model saved as upi_fraud_model.pkl")
