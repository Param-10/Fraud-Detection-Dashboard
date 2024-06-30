# Fraud Detection Dashboard

This dashboard application utilizes a trained machine learning model to detect potentially fraudulent transactions from uploaded datasets.

## Features

- Upload CSV files containing transaction data
- Predict whether transactions are potentially fraudulent using a pre-trained logistic regression model
- Display prediction results with confidence scores
- Visualize prediction distribution through a pie chart
- Show summary statistics of transaction amounts

## Installation

### Requirements

- Python 3.x
- Libraries: dash, pandas, scikit-learn, joblib, plotly

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your_username/fraud-detection-dashboard.git
   cd fraud-detection-dashboard
   ```

2. Install dependencies:
   ```bash
   pip install dash pandas scikit-learn joblib plotly
   ```

3. Run the application:
   ```bash
   python app.py
   ```

4. Access the dashboard in your web browser at `http://127.0.0.1:8050/`

## Usage

1. **Upload Data:**
   - Use the drag-and-drop area or click to select a CSV file containing transaction data
   - Ensure the CSV file has the correct structure (30 numeric columns including 'Amount' and 'Time')

2. **View Predictions:**
   - After upload, the dashboard displays predictions for each transaction
   - Predictions are categorized as "Not Fraudulent" or "Potentially Fraudulent" with confidence scores

3. **Explore Visualizations:**
   - A pie chart shows the distribution of fraudulent vs. non-fraudulent predictions
   - Summary statistics display total and average transaction amounts

## Understanding Confidence Scores

- Confidence scores range from 0 to 1
- Scores close to 1 indicate high confidence in potential fraud
- Scores close to 0 indicate high confidence in non-fraudulent transactions
- Scores around 0.5 suggest uncertainty and may warrant further investigation

## Customization

- The model file path can be adjusted in the code (`saved_model.pkl`)
- Dashboard layout and styling can be modified using Dash and Plotly components

## Future Improvements

- Implement feature importance visualization
- Add a threshold adjustment slider for fraud classification
- Enable multiple file uploads for comparison
- Incorporate more advanced visualizations and analytics

## Contributing

Contributions to improve the dashboard are welcome. Please fork the repository and submit pull requests for any enhancements.

## License

This project is open-source and available under the MIT License.

## Contact

For questions or suggestions, please contact:

[Your Name]
Email: [Your Email Address]
GitHub: [Your GitHub Profile]

```