import pandas as pd
from sklearn.impute import SimpleImputer
from imblearn.over_sampling import SMOTE
from sklearn.preprocessing import StandardScaler

# Load your datasets
csv_file1 = '/Users/paramveer/SPAM-Detector-ML/creditcard.csv'
csv_file2 = '/Users/paramveer/SPAM-Detector-ML/creditcard2.csv'

# Load CSV files into DataFrames
df1 = pd.read_csv(csv_file1)
df2 = pd.read_csv(csv_file2)

# Merge DataFrames
merged_df = pd.concat([df1, df2], ignore_index=True)

# Handle NaN values
# For demonstration, using SimpleImputer to fill NaN with mean, you can choose another strategy if needed
imputer = SimpleImputer(strategy='mean')
merged_df = pd.DataFrame(imputer.fit_transform(merged_df), columns=merged_df.columns)

# Save merged data to a new CSV file
output_csv = '/Users/paramveer/SPAM-Detector-ML/merged_creditcard.csv'
merged_df.to_csv(output_csv, index=False)  # Set index=False to avoid saving the index column

# Separate features and target variable
X = merged_df.drop('Class', axis=1)
y = merged_df['Class']

# Apply SMOTE for oversampling
smote = SMOTE(sampling_strategy='auto', random_state=42)
X_resampled, y_resampled = smote.fit_resample(X, y)

# Optionally, scale the features
scaler = StandardScaler()
X_resampled_scaled = scaler.fit_transform(X_resampled)

# Now you can proceed with model training or further analysis