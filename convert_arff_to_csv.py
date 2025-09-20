import pandas as pd
from scipy.io import arff

# Load your ARFF file
data = arff.loadarff('Training Dataset.arff')

# Convert to pandas DataFrame
df = pd.DataFrame(data[0])

# Save as CSV
df.to_csv('phishing.csv', index=False)

print("✅ Done! Saved as phishing.csv")
