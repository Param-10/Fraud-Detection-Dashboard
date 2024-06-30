import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

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
card_data.groupby('Class').mean()














