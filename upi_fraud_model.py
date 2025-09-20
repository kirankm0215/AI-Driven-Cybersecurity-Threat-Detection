import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib

# Load dataset
df = pd.read_csv("UPI_Fraud_Data.csv")

# Preview dataset
print("Dataset shape:", df.shape)
print("Columns:", df.columns.tolist())
print(df.head())

# Drop any irrelevant or non-numeric columns (if needed)
# Example: df.drop(['TransactionID', 'TimeStamp'], axis=1, inplace=True)

# Handle missing values if any
df.dropna(inplace=True)

# Split features and labels
X = df.drop("is_fraud", axis=1)  # Make sure this column exists and is the label
y = df["is_fraud"]

# Split into train/test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
print("Classification Report:\n", classification_report(y_test, y_pred))

# Save model
joblib.dump(model, "upi_fraud_model.pkl")
print("✅ Model saved as upi_fraud_model.pkl")
