import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
#first we have imported all the required libraries for this project
card_data = pd.read_csv('/Users/paramveer/SPAM-Detector-ML/creditcard.csv') #read the file

card_data.head() #first 5 rows

card_data.tail() #last 5 rows

card_data.info() #information about the data

card_data.isnull().sum() #checking for null values

card_data['Class'].value_counts() #checking the distribution of legit and fraudulent transactions

legit = card_data[card_data.Class == 0] #represents legit transactions - 0 is legit

fraud = card_data[card_data.Class == 1] #represents fraud transactions - 1 is not legit

print(legit.shape) #(legit transactions, total columns)
print(fraud.shape) #(fraud transactions, total columns)

legit.Amount.describe() #describing the legit transactions and gives us the statistical measures of the data
#values would be shown in percentiles.
fraud.Amount.describe() 
#we can see that the mean of the fraud transactions is much higher than the legit transactions
#we can also see that the standard deviation of the fraud transactions is much higher than the legit transactions
#this means that the fraud transactions are more spread out than the legit transactions
#this is a good thing because it means that we can use this information to our advantage when trying to detect fraud transactions

#compare the values for both transactions
card_data.groupby('Class').mean() #here we are comparing the means between both of them

#under sampling

#we will build a sample data for this which will contain similar distribution of the legit and fraudulant transactions
#building a sample data set
legit_sample = legit.sample(n=492) #n is the number of samples we want to take from the legit transactions
# we are concatenating both the legit sample and fraud to create a new dataset
new_dataset=pd.concat([legit_sample,fraud],axis=0)  #axis 0 means rows and axis 1 means columns
new_dataset.head()
new_dataset.tail()
new_dataset['Class'].value_counts()#gives us the total value count for this dataset
new_dataset.groupby('Class').mean() #here we are comparing the means between both of them as the nature of the data set has not changed

#splitting the data into features and targets
X = new_dataset.drop(columns='Class',axis=1) #removing the class column
Y = new_dataset['Class']

#split the data into training data and test data, they will be split randomly
X_train,X_test,Y_train,Y_test = train_test_split(X,Y,test_size=0.2,stratify=Y,random_state=2) #0.2 goes to the testing data and the 0.8 to the training data
#stratify is used to make sure that the distribution of the data is similar in both the training data and testing data. even distribution
#random_state is used to make sure that the data is split in the same way everytime we run
print(X.shape,X_train.shape,X_test.shape) #(total rows, total columns)

# Scale the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Initialize Logistic Regression model
model = LogisticRegression(max_iter=1000)  # Increase max_iter as needed

# Fit the model
model.fit(X_train_scaled, Y_train)

# Predict on test set
X_train_prediction=model.predict(X_train_scaled)

#accuracy score
training_data_accuracy=accuracy_score(X_train_prediction, Y_train)

print('Accuracy on Training data: {:.2f}%'.format(training_data_accuracy * 100))

#accuracy on test data
X_test_prediction = model.predict(X_test_scaled)
test_data_accuracy = accuracy_score(X_test_prediction, Y_test)

print('Accuracy on Test data: {:.2f}%'.format(test_data_accuracy * 100))
#if there is a vast difference between the accuracy on test data and trained data then there is underfitting or overfitting




























