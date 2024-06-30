import dash
from dash import dcc, html, Input, Output
from dash import dash_table
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
import joblib
import base64
import io
import plotly.graph_objs as go

# Load your trained model
model = joblib.load('/Users/paramveer/SPAM-Detector-ML/saved_model.pkl')

# Initialize the Dash app
app = dash.Dash(__name__)

# External CSS styles for Bootstrap (optional)
external_stylesheets = ['https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css']
app = dash.Dash(__name__, external_stylesheets=external_stylesheets)

# Define CSS styles for the components
styles = {
    'header-title': {
        'textAlign': 'center',
        'margin': '20px'
    },
    'output-container': {
        'margin': '20px'
    },
    'prediction-class': {
        'fontWeight': 'bold',
        'fontSize': '16px'
    },
    'confidence-score': {
        'fontSize': '14px',
        'marginLeft': '5px'
    },
    'tooltip': {
        'fontWeight': 'bold',
        'cursor': 'help',
        'textDecoration': 'underline',
        'marginLeft': '5px'
    }
}

# Define the layout of the dashboard
app.layout = html.Div([
    html.H1('Fraud Detection Dashboard', style=styles['header-title']),
    
    dcc.Upload(
        id='upload-data',
        children=html.Div([
            'Drag and Drop or ',
            html.A('Select Files')
        ]),
        style={
            'width': '100%',
            'height': '60px',
            'lineHeight': '60px',
            'borderWidth': '1px',
            'borderStyle': 'dashed',
            'borderRadius': '5px',
            'textAlign': 'center',
            'margin': '10px'
        },
        multiple=False
    ),

    html.Div(id='output-data-upload', style=styles['output-container']),
])

# Callback to handle file upload and display predictions
@app.callback(
    Output('output-data-upload', 'children'),
    [Input('upload-data', 'contents')],
)
def update_output(contents):
    if contents is not None:
        content_type, content_string = contents.split(',')
        decoded = base64.b64decode(content_string)
        try:
            df = pd.read_csv(io.StringIO(decoded.decode('utf-8')))
            
            # Ensure all columns are numeric
            numeric_columns = df.select_dtypes(include=[np.number]).columns
            X_new = df[numeric_columns]
            
            # Scale the features
            scaler = StandardScaler()
            X_new_scaled = scaler.fit_transform(X_new)
            
            # Predict using the model
            X_pred = model.predict(X_new_scaled)
            X_pred_proba = model.predict_proba(X_new_scaled)[:, 1]  # Probability of fraud
            
            # Create prediction interpretation
            prediction_interpretation = ['Not Fraudulent' if pred == 0 else 'Potentially Fraudulent' for pred in X_pred]
            
            # Create a pie chart of predictions
            labels = ['Not Fraudulent', 'Potentially Fraudulent']
            values = [sum(X_pred == 0), sum(X_pred == 1)]
            pie_chart = dcc.Graph(
                figure=go.Figure(data=[go.Pie(labels=labels, values=values)])
            )
            
            # Calculate summary statistics
            total_amount = df['Amount'].sum()
            avg_amount = df['Amount'].mean()
            
            # Display predictions and visualizations
            return html.Div([
                html.H5('Prediction Results'),
                dash_table.DataTable(
                    data=X_new.to_dict('records'),
                    columns=[{'name': i, 'id': i} for i in X_new.columns],
                    page_size=10
                ),
                html.H6('Predictions:'),
                html.Ul([
                    html.Li([
                        html.Span(f"Row {i+1}: ", className='tooltip', title='Transaction Details'),
                        html.Span(f"{interp} ", className='prediction-class', style={'color': 'red' if X_pred[i] == 1 else 'green'}),
                        html.Span(f"(Confidence: {proba:.2f})", className='confidence-score', title='Confidence Score')
                    ]) for i, (interp, proba) in enumerate(zip(prediction_interpretation, X_pred_proba))
                ]),
                html.H6('Prediction Distribution:'),
                pie_chart,
                html.H6('Summary Statistics:'),
                html.P(f"Total Transaction Amount: ${total_amount:.2f}"),
                html.P(f"Average Transaction Amount: ${avg_amount:.2f}"),
            ])
        except Exception as e:
            return html.Div([
                html.H5('Error Processing File'),
                html.P(f'Error details: {str(e)}'),
                html.P('Please check the file format and ensure it matches the expected structure.'),
                html.P('Expected columns: ' + ', '.join(model.feature_names_in_) if hasattr(model, 'feature_names_in_') else 'Unknown'),
                html.P('Actual columns: ' + ', '.join(df.columns) if 'df' in locals() else 'Unable to read columns')
            ])

if __name__ == '__main__':
    app.run_server(debug=True)