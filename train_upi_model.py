import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report
import joblib

# Load dataset
df = pd.read_csv("UPI_Fraud_Data.csv")

# Encode categorical features
le = LabelEncoder()
df['sender_encoded'] = le.fit_transform(df['sender_upi_id'])
df['receiver_encoded'] = le.fit_transform(df['receiver_upi_id'])
df['location_encoded'] = le.fit_transform(df['location'])

# Features and target
X = df[['amount', 'sender_encoded', 'receiver_encoded', 'location_encoded']]
y = df['is_fraud']

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

# Evaluate
y_pred = clf.predict(X_test)
print(classification_report(y_test, y_pred))

# Save model
joblib.dump(clf, "upi_fraud_model.pkl")
print("✅ Model saved as upi_fraud_model.pkl")
