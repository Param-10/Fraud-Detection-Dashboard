export class UIManager {
    constructor() {
        this.isDarkMode = localStorage.getItem('darkMode') === 'true'
    }

    init() {
        this.setupTheme()
        this.renderUI()
    }

    setupTheme() {
        if (this.isDarkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        this.updateThemeIcon()
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode
        localStorage.setItem('darkMode', this.isDarkMode)
        this.setupTheme()
    }

    updateThemeIcon() {
        const themeIcon = document.getElementById('theme-icon')
        if (themeIcon) {
            themeIcon.innerHTML = this.isDarkMode 
                ? '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636a9 9 0 101.591 1.591z" />'
                : '<path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />'
        }
    }

    renderUI() {
        const app = document.getElementById('app')
        app.innerHTML = `
            <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <!-- Header -->
                <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex justify-between items-center h-16">
                            <div class="flex items-center space-x-3">
                                <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                    </svg>
                                </div>
                                <h1 class="text-xl font-bold text-gray-900 dark:text-white">Fraud Detection Dashboard</h1>
                            </div>
                            <button id="theme-toggle" class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                <svg id="theme-icon" class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>

                <!-- Main Content -->
                <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <!-- Welcome Section -->
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Fraud Detection</h2>
                        <p class="text-gray-600 dark:text-gray-300 mb-6">
                            Upload your transaction data to analyze potential fraudulent activities using our advanced machine learning model.
                            The system will provide confidence scores and risk assessments for each transaction.
                        </p>
                        
                        <!-- Upload Section -->
                        <div class="space-y-4">
                            <div id="drop-zone" class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer">
                                <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <p class="text-lg font-medium text-gray-900 dark:text-white mb-2">Drop your CSV file here</p>
                                <p class="text-gray-500 dark:text-gray-400 mb-4">or click to browse</p>
                                <input type="file" id="file-input" accept=".csv" class="hidden">
                                <button onclick="document.getElementById('file-input').click()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                    Choose File
                                </button>
                            </div>
                            
                            <div class="text-center">
                                <span class="text-gray-500 dark:text-gray-400">or</span>
                            </div>
                            
                            <button id="load-sample" class="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors">
                                Load Sample Data
                            </button>
                        </div>
                    </div>

                    <!-- Loading Indicator -->
                    <div id="loading" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-4">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span class="text-gray-900 dark:text-white font-medium">Processing data...</span>
                        </div>
                    </div>

                    <!-- Error Message -->
                    <div id="error-message" class="hidden bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
                        <div class="flex">
                            <svg class="w-5 h-5 text-red-400 dark:text-red-300 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p id="error-text" class="text-red-700 dark:text-red-200"></p>
                        </div>
                    </div>

                    <!-- Results Section -->
                    <div id="results-container" class="hidden space-y-8">
                        <!-- Statistics Cards -->
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <div class="flex items-center">
                                    <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                        <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                        </svg>
                                    </div>
                                    <div class="ml-4">
                                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Transactions</p>
                                        <p id="total-transactions" class="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <div class="flex items-center">
                                    <div class="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                                        <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                        </svg>
                                    </div>
                                    <div class="ml-4">
                                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Fraudulent</p>
                                        <p id="fraudulent-count" class="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <div class="flex items-center">
                                    <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                        <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <div class="ml-4">
                                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Legitimate</p>
                                        <p id="legitimate-count" class="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <div class="flex items-center">
                                    <div class="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                                        <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                        </svg>
                                    </div>
                                    <div class="ml-4">
                                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Fraud Rate</p>
                                        <p id="fraud-rate" class="text-2xl font-bold text-gray-900 dark:text-white">0%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Charts Section -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Prediction Distribution</h3>
                                <canvas id="pie-chart" width="400" height="400"></canvas>
                            </div>

                            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Confidence Distribution</h3>
                                <canvas id="confidence-chart" width="400" height="400"></canvas>
                            </div>
                        </div>

                        <!-- Transaction Table -->
                        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Transaction Details</h3>
                            <div id="transaction-table"></div>
                        </div>
                    </div>
                </main>
            </div>
        `
        this.updateThemeIcon()
    }

    showLoading(show) {
        const loading = document.getElementById('loading')
        if (show) {
            loading.classList.remove('hidden')
        } else {
            loading.classList.add('hidden')
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('error-message')
        const errorText = document.getElementById('error-text')
        errorText.textContent = message
        errorDiv.classList.remove('hidden')
        
        setTimeout(() => {
            errorDiv.classList.add('hidden')
        }, 5000)
    }
}