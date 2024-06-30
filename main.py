import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from imblearn.over_sampling import SMOTE
from sklearn.calibration import CalibratedClassifierCV
import joblib

# Define expected columns
expected_columns = ['Time', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9',
                    'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17', 'V18',
                    'V19', 'V20', 'V21', 'V22', 'V23', 'V24', 'V25', 'V26', 'V27',
                    'V28', 'Amount']

# Load your dataset
card_data = pd.read_csv('/Users/paramveer/SPAM-Detector-ML/merged_creditcard.csv')

# Remove 'id' column if it exists
if 'id' in card_data.columns:
    card_data = card_data.drop('id', axis=1)

# Ensure only expected columns are present
card_data = card_data[expected_columns + ['Class']]

# Explore dataset
print(card_data.head())  # Display first 5 rows
print(card_data.tail())  # Display last 5 rows
print(card_data.info())  # Display dataset information
print(card_data.isnull().sum())  # Check for null values
print(card_data['Class'].value_counts())  # Check class distribution

# Separate features and target
X = card_data[expected_columns]
Y = card_data['Class']

# Implementing SMOTE for oversampling
smote = SMOTE(sampling_strategy='auto', random_state=42)
X_resampled, Y_resampled = smote.fit_resample(X, Y)

# Split the resampled data into training and testing sets
X_train, X_test, Y_train, Y_test = train_test_split(X_resampled, Y_resampled, test_size=0.2, stratify=Y_resampled, random_state=2)

# Scale the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Initialize Logistic Regression model
model = LogisticRegression(max_iter=1000, random_state=42)  # Increase max_iter as needed

# Hyperparameter tuning using GridSearchCV
param_grid = {'C': [0.001, 0.01, 0.1, 1, 10, 100]}
grid_search = GridSearchCV(estimator=model, param_grid=param_grid, cv=5, scoring='accuracy')
grid_search.fit(X_train_scaled, Y_train)

best_model = grid_search.best_estimator_

# Fit the best model
best_model.fit(X_train_scaled, Y_train)

# Predict on training set
Y_train_pred = best_model.predict(X_train_scaled)

# Evaluate training accuracy
training_accuracy = accuracy_score(Y_train, Y_train_pred)
print('Training Accuracy: {:.2f}%'.format(training_accuracy * 100))

# Predict on test set
Y_test_pred = best_model.predict(X_test_scaled)

# Evaluate test accuracy
test_accuracy = accuracy_score(Y_test, Y_test_pred)
print('Test Accuracy: {:.2f}%'.format(test_accuracy * 100))

# Display classification report and confusion matrix
print('Classification Report:')
print(classification_report(Y_test, Y_test_pred))
print('Confusion Matrix:')
print(confusion_matrix(Y_test, Y_test_pred))

# Calibrate the best model
calibrated_model = CalibratedClassifierCV(best_model, cv=5, method='sigmoid')
calibrated_model.fit(X_train_scaled, Y_train)

# Predict probabilities on test set
Y_test_proba = calibrated_model.predict_proba(X_test_scaled)[:, 1]

# Choose a threshold (e.g., 0.5)
threshold = 0.5
Y_test_pred_calibrated = (Y_test_proba >= threshold).astype(int)

# Evaluate calibrated model
calibrated_accuracy = accuracy_score(Y_test, Y_test_pred_calibrated)
print('Calibrated Test Accuracy: {:.2f}%'.format(calibrated_accuracy * 100))

print('Calibrated Classification Report:')
print(classification_report(Y_test, Y_test_pred_calibrated))
print('Calibrated Confusion Matrix:')
print(confusion_matrix(Y_test, Y_test_pred_calibrated))

# Save the model, scaler, and feature names
joblib.dump(best_model, 'saved_model.pkl')
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(expected_columns, 'feature_names.pkl')

print("Model, scaler, and feature names saved successfully.")