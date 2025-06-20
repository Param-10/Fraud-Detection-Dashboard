# Fraud Detection Dashboard

A modern, responsive web application for detecting fraudulent transactions using machine learning. Built with vanilla JavaScript, Tailwind CSS, and Chart.js.

## Features

- 🔍 **Real-time Fraud Detection**: Upload CSV files and get instant fraud predictions
- 🌓 **Dark/Light Mode**: Toggle between themes with persistent preference
- 📊 **Interactive Charts**: Visualize prediction distributions and confidence levels
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🎯 **Risk Assessment**: Color-coded risk levels for easy identification
- 📈 **Detailed Analytics**: Comprehensive statistics and transaction details

## Live Demo

Visit the live application: [Fraud Detection Dashboard](https://yourusername.github.io/fraud-detection-dashboard/)

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fraud-detection-dashboard.git
cd fraud-detection-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Uploading Data

1. **CSV Upload**: Drag and drop a CSV file or click to browse
2. **Sample Data**: Click "Load Sample Data" to test with generated data
3. **Required Format**: CSV should contain transaction features (V1-V28, Time, Amount)

### Understanding Results

- **Statistics Cards**: Overview of total, fraudulent, and legitimate transactions
- **Pie Chart**: Visual distribution of predictions
- **Confidence Chart**: Histogram of prediction confidence levels
- **Transaction Table**: Detailed view with risk levels and confidence scores

### Risk Levels

- 🟢 **Safe**: Legitimate transactions
- 🟡 **Low Risk**: Low confidence fraud predictions
- 🟠 **Medium Risk**: Medium confidence fraud predictions
- 🔴 **High Risk**: High confidence fraud predictions

## Deployment

### GitHub Pages (Automatic)

1. Push your code to the `main` branch
2. GitHub Actions will automatically build and deploy
3. Your site will be available at `https://yourusername.github.io/fraud-detection-dashboard/`

### Manual Build

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Styling**: Tailwind CSS
- **Charts**: Chart.js
- **Build Tool**: Vite
- **Deployment**: GitHub Pages with GitHub Actions

## Project Structure

```
├── src/
│   ├── main.js              # Main application entry point
│   ├── fraud-detector.js    # ML model implementation
│   ├── ui-manager.js        # UI state management
│   ├── chart-manager.js     # Chart creation and management
│   └── style.css           # Custom styles and Tailwind imports
├── public/
│   └── fraud-icon.svg      # Application icon
├── .github/workflows/
│   └── deploy.yml          # GitHub Actions deployment
├── index.html              # Main HTML file
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
├── vite.config.js          # Vite configuration
└── README.md              # This file
```

## Features in Detail

### Machine Learning Model

The application uses a simplified logistic regression model that:
- Processes 30 transaction features (V1-V28, Time, Amount)
- Applies feature scaling and normalization
- Generates confidence scores for predictions
- Classifies transactions as fraudulent or legitimate

### User Interface

- **Modern Design**: Clean, professional interface with smooth animations
- **Accessibility**: Proper contrast ratios and keyboard navigation
- **Performance**: Optimized for fast loading and smooth interactions
- **Mobile-First**: Responsive design that works on all devices

### Data Visualization

- **Interactive Charts**: Built with Chart.js for smooth animations
- **Theme-Aware**: Charts adapt to dark/light mode
- **Real-time Updates**: Charts update instantly when new data is processed

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Original Python implementation for model inspiration
- Tailwind CSS for the utility-first styling approach
- Chart.js for beautiful, responsive charts
- GitHub Pages for free hosting