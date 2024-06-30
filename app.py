import dash
from dash import dcc, html, Input, Output, dash_table
import numpy as np
import pandas as pd
import joblib
import base64
import io
import os
import plotly.graph_objs as go
import plotly.express as px
from sklearn.metrics import roc_curve, confusion_matrix

# Set up Dash app and server
app = dash.Dash(__name__, assets_folder='static')

# Load your trained model, scaler, and feature names
model_path = os.path.join('static', 'saved_model.pkl')
scaler_path = os.path.join('static', 'scaler.pkl')
feature_names_path = os.path.join('static', 'feature_names.pkl')

model = joblib.load(model_path)
scaler = joblib.load(scaler_path)
expected_columns = joblib.load(feature_names_path)

# Define colors and styles
colors = {
    'background': '#f8f9fa',
    'text': '#2c3e50',
    'accent': '#3498db',
    'error': '#e74c3c'
}

# Define the layout of the dashboard
app.layout = html.Div(style={'fontFamily': 'Arial', 'backgroundColor': colors['background'], 'padding': '20px'}, children=[
    html.H1('Fraud Detection Dashboard', style={'textAlign': 'center', 'color': colors['text']}),

    dcc.Markdown('''
        ### Welcome to the Fraud Detection Dashboard
        This tool allows you to upload transaction data and check for potentially fraudulent activity using a trained model.
        
        **Instructions:**
        - **Upload a CSV file with transaction data.**
        - **The model will analyze the data and provide predictions on whether each transaction is fraudulent.**
        - **Visualizations will help you interpret the results.**
        
        **Understanding the Results:**
        - **Confidence Levels**: Each prediction includes a confidence score. Higher scores indicate a higher likelihood of fraud.
        - **Fraudulent**: Transactions predicted as potentially fraudulent should be reviewed carefully.
        - **Not Fraudulent**: Transactions predicted as not fraudulent are likely legitimate.
        - **Correlation Heatmap**: This visualization shows the relationships between features, helping identify patterns in the data.
        - **ROC Curve**: Illustrates the model's performance. A curve closer to the top-left indicates better performance.
        - **Confusion Matrix**: Displays true vs. predicted classifications, helping to understand accuracy.
    ''', style={'margin': '20px', 'padding': '10px', 'backgroundColor': '#ecf0f1', 'borderRadius': '5px'}),

    dcc.Upload(
        id='upload-data',
        children=html.Div([
            'Drag and Drop or ',
            html.A('Select Files', style={'color': colors['accent']})
        ]),
        style={
            'width': '100%',
            'height': '60px',
            'lineHeight': '60px',
            'borderWidth': '1px',
            'borderStyle': 'dashed',
            'borderRadius': '5px',
            'textAlign': 'center',
            'margin': '10px',
            'backgroundColor': '#ecf0f1',
            'borderColor': colors['accent']
        },
        multiple=False
    ),

    html.Div(id='output-data-upload'),
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
            
            # Ensure all expected columns are present
            for col in expected_columns:
                if col not in df.columns:
                    df[col] = 0  # or some appropriate default value

            # Select only the expected columns in the correct order
            X_new = df[expected_columns]
            
            # Scale the features using the loaded scaler
            X_new_scaled = scaler.transform(X_new)
            
            # Predict using the model
            X_pred = model.predict(X_new_scaled)
            X_pred_proba = model.predict_proba(X_new_scaled)[:, 1]
            
            # Create prediction interpretation
            prediction_interpretation = ['Not Fraudulent' if pred == 0 else 'Potentially Fraudulent' for pred in X_pred]
            
            # Create a pie chart of predictions
            labels = ['Not Fraudulent', 'Potentially Fraudulent']
            values = [sum(X_pred == 0), sum(X_pred == 1)]
            pie_chart = dcc.Graph(
                figure=go.Figure(
                    data=[go.Pie(labels=labels, values=values, hole=0.4, marker=dict(colors=['#2ecc71', '#e74c3c']))],
                    layout=go.Layout(title='Prediction Distribution', title_x=0.5)
                )
            )
            
            elements = [
                html.H2('Prediction Results', style={'color': colors['text']}),
                dash_table.DataTable(
                    data=X_new.to_dict('records'),
                    columns=[{'name': i, 'id': i} for i in X_new.columns],
                    page_size=10,
                    style_table={'overflowX': 'auto', 'backgroundColor': '#ffffff'},
                    style_header={'backgroundColor': colors['accent'], 'color': 'white'},
                    style_cell={'textAlign': 'center', 'padding': '10px'}
                ),
                html.H3('Predictions:', style={'color': colors['text']}),
                html.Ul([html.Li(f"Row {i+1}: {interp} (Confidence: {proba:.2f})", style={'color': colors['text']}) 
                         for i, (interp, proba) in enumerate(zip(prediction_interpretation, X_pred_proba))]),
                pie_chart,
            ]

            if 'Class' in df.columns:
                cm = confusion_matrix(df['Class'], X_pred)
                confusion_fig = px.imshow(cm, text_auto=True, color_continuous_scale='Blues',
                                          labels={'x': 'Predicted', 'y': 'Actual'},
                                          x=labels, y=labels)
                
                fpr, tpr, _ = roc_curve(df['Class'], X_pred_proba)
                roc_fig = go.Figure()
                roc_fig.add_trace(go.Scatter(x=fpr, y=tpr, mode='lines', name='ROC Curve'))
                roc_fig.add_trace(go.Scatter(x=[0, 1], y=[0, 1], mode='lines', name='Random Classifier',
                                             line=dict(dash='dash')))
                roc_fig.update_layout(title='ROC Curve', xaxis_title='False Positive Rate',
                                      yaxis_title='True Positive Rate')
                
                elements.extend([
                    html.H3('ROC Curve:', style={'color': colors['text']}),
                    dcc.Graph(figure=roc_fig),
                    html.H3('Confusion Matrix:', style={'color': colors['text']}),
                    dcc.Graph(figure=confusion_fig),
                ])
                
            # Correlation heatmap
            corr = df.corr()
            correlation_fig = px.imshow(corr, text_auto=True, color_continuous_scale='Viridis')
            heatmap_info = html.Div([
                html.H3('Correlation Heatmap:', style={'color': colors['text']}),
                dcc.Graph(figure=correlation_fig),
                html.P('''The correlation heatmap shows the relationships between different features in your dataset.
                    Positive correlations are shown in green and negative correlations in red. High absolute values indicate a strong relationship.''', 
                    style={'marginTop': '10px', 'color': colors['text']})
            ])
            
            elements.append(heatmap_info)
            
            return html.Div(elements)

        except Exception as e:
            return html.Div([
                html.H5('Error Processing File', style={'color': colors['error']}),
                html.P(f'Error details: {str(e)}'),
                html.P('Please check the file format and ensure it matches the expected structure.'),
                html.P('Expected columns: ' + ', '.join(expected_columns)),
                html.P('Actual columns: ' + ', '.join(df.columns) if 'df' in locals() else 'Unable to read columns')
            ])

if __name__ == '__main__':
    app.run_server(debug=True)