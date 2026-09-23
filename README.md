# Fraud Detection Dashboard

A full-stack fraud detection system featuring an interactive web dashboard for real-time visualization alongside a Python/Dash machine learning backend for model training and evaluation.

> [!NOTE]
> **Client-Side Simulation Notice:**
> The browser frontend (deployed on Netlify) runs an **interactive client-side heuristic simulation** using illustrative feature weights for fast, zero-backend UI exploration and chart rendering.
> The actual trained Scikit-learn machine learning pipeline and Dash application reside in [`python-backend/`](python-backend/).

## Features

- **Interactive Simulation Dashboard**: Instant browser-side transaction evaluation and risk scoring for fast UI feedback
- **Data Visualization**: Charts and analytics for prediction distributions (Chart.js)
- **Risk Assessment**: Color-coded risk tiers (High / Medium / Low / Safe) for transaction analysis
- **Machine Learning Backend**: Python/Dash service with Scikit-learn models trained on transaction datasets

## Live Demo

- Frontend Dashboard: [Deployed on Netlify](https://fraud-detector-dashboard.netlify.app/)

## Technology Stack

**Frontend:**
- Vite + JavaScript
- Tailwind CSS
- Chart.js

**Backend:**
- Python + Dash
- Scikit-learn
- Pandas, NumPy
- Plotly

## Quick Start

### Frontend Development

```bash
npm install
npm run dev
```

### Python Backend

```bash
cd python-backend
pip install dash scikit-learn pandas numpy plotly
python app.py
```

## Deployment

### Frontend (Netlify)

The frontend is configured for automatic deployment to Netlify:

- Build command: `npm install --legacy-peer-deps && npm run build`
- Publish directory: `dist`
- Node version: 18

### Backend Deployment

The Python backend can be deployed to platforms like:
- PythonAnywhere
- Heroku
- Railway
- DigitalOcean

## Usage

1. **Upload CSV**: Drag and drop transaction data
2. **View Results**: Analyze predictions with confidence scores
3. **Interpret Charts**: Review distribution and correlation visualizations
4. **Risk Assessment**: Examine color-coded transaction risk levels

## Project Structure

```
├── src/                 # Frontend source code
├── python-backend/      # Python ML backend
│   ├── app.py          # Dash application
│   ├── main.py         # Additional scripts
│   ├── requirements.txt # Python dependencies
│   └── static/         # ML model files
├── dist/               # Built frontend files
└── netlify.toml        # Netlify configuration
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.