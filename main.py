import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from imblearn.over_sampling import SMOTE
import joblib

# Load your dataset
card_data = pd.read_csv('/Users/paramveer/SPAM-Detector-ML/creditcard.csv')

# Explore dataset
print(card_data.head())  # Display first 5 rows
print(card_data.tail())  # Display last 5 rows
print(card_data.info())  # Display dataset information
print(card_data.isnull().sum())  # Check for null values
print(card_data['Class'].value_counts())  # Check class distribution

# Separate legitimate and fraudulent transactions
legit = card_data[card_data['Class'] == 0]
fraud = card_data[card_data['Class'] == 1]

# Describe transaction amounts for legit and fraud classes
print(legit['Amount'].describe())
print(fraud['Amount'].describe())

# Compare means between legit and fraud transactions
print(card_data.groupby('Class').mean())

# Implementing SMOTE for oversampling
smote = SMOTE(sampling_strategy='auto', random_state=42)
X_resampled, Y_resampled = smote.fit_resample(card_data.drop('Class', axis=1), card_data['Class'])

# Split data into features and target
X = pd.DataFrame(X_resampled, columns=card_data.drop('Class', axis=1).columns)
Y = pd.DataFrame(Y_resampled, columns=['Class'])

# Split the data into training and testing sets
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, stratify=Y, random_state=2)

# Scale the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Initialize Logistic Regression model
model = LogisticRegression(max_iter=1000, random_state=42)  # Increase max_iter as needed

# Hyperparameter tuning using GridSearchCV
param_grid = {'C': [0.001, 0.01, 0.1, 1, 10, 100]}
grid_search = GridSearchCV(estimator=model, param_grid=param_grid, cv=5, scoring='accuracy')
grid_search.fit(X_train_scaled, Y_train.values.ravel())

best_model = grid_search.best_estimator_

# Fit the best model
best_model.fit(X_train_scaled, Y_train.values.ravel())

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

# Save the model
joblib.dump(best_model, 'saved_model.pkl')