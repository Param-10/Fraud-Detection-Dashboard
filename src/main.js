import './style.css'
import { FraudDetector } from './fraud-detector.js'
import { UIManager } from './ui-manager.js'
import { ChartManager } from './chart-manager.js'

class App {
    constructor() {
        this.fraudDetector = new FraudDetector()
        this.uiManager = new UIManager()
        this.chartManager = new ChartManager()
        this.init()
    }

    init() {
        this.uiManager.init()
        this.setupEventListeners()
    }

    setupEventListeners() {
        // Wait for UI to be rendered before setting up event listeners
        setTimeout(() => {
            this.setupFileUpload()
            this.setupSampleData()
            this.setupThemeToggle()
        }, 100)
    }

    setupFileUpload() {
        const fileInput = document.getElementById('file-input')
        const dropZone = document.getElementById('drop-zone')

        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e.target.files[0]))
        }
        
        if (dropZone) {
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault()
                dropZone.classList.add('drag-over')
            })
            
            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('drag-over')
            })
            
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault()
                dropZone.classList.remove('drag-over')
                this.handleFileUpload(e.dataTransfer.files[0])
            })

            dropZone.addEventListener('click', () => {
                fileInput?.click()
            })
        }
    }

    setupSampleData() {
        const sampleButton = document.getElementById('load-sample')
        if (sampleButton) {
            sampleButton.addEventListener('click', () => {
                this.loadSampleData()
            })
        }
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle')
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.uiManager.toggleTheme()
            })
        }
    }

    async handleFileUpload(file) {
        if (!file) return

        if (!file.name.endsWith('.csv')) {
            this.uiManager.showError('Please upload a CSV file')
            return
        }

        this.uiManager.showLoading(true)
        
        try {
            const text = await file.text()
            const data = this.parseCSV(text)
            await this.processData(data)
        } catch (error) {
            console.error('Error processing file:', error)
            this.uiManager.showError('Error processing file: ' + error.message)
        } finally {
            this.uiManager.showLoading(false)
        }
    }

    parseCSV(text) {
        const lines = text.trim().split('\n')
        const headers = lines[0].split(',').map(h => h.trim())
        const data = []

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',')
            const row = {}
            headers.forEach((header, index) => {
                row[header] = parseFloat(values[index]) || 0
            })
            data.push(row)
        }

        return { headers, data }
    }

    async processData(csvData) {
        try {
            const predictions = await this.fraudDetector.predict(csvData.data)
            this.displayResults(csvData, predictions)
        } catch (error) {
            console.error('Error processing data:', error)
            this.uiManager.showError('Error processing data: ' + error.message)
        }
    }

    displayResults(csvData, predictions) {
        const resultsContainer = document.getElementById('results-container')
        if (resultsContainer) {
            resultsContainer.classList.remove('hidden')
        }

        // Update statistics
        const totalTransactions = predictions.length
        const fraudulentCount = predictions.filter(p => p.prediction === 1).length
        const legitimateCount = totalTransactions - fraudulentCount
        const fraudRate = totalTransactions > 0 ? ((fraudulentCount / totalTransactions) * 100).toFixed(1) : '0'

        this.updateElement('total-transactions', totalTransactions)
        this.updateElement('fraudulent-count', fraudulentCount)
        this.updateElement('legitimate-count', legitimateCount)
        this.updateElement('fraud-rate', fraudRate + '%')

        // Create charts
        this.chartManager.createPieChart(fraudulentCount, legitimateCount)
        this.chartManager.createConfidenceChart(predictions)

        // Display transaction table
        this.displayTransactionTable(csvData, predictions)
    }

    updateElement(id, value) {
        const element = document.getElementById(id)
        if (element) {
            element.textContent = value
        }
    }

    displayTransactionTable(csvData, predictions) {
        const tableContainer = document.getElementById('transaction-table')
        if (!tableContainer) return
        
        let tableHTML = `
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Row</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Prediction</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Confidence</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Risk Level</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
        `

        predictions.forEach((pred, index) => {
            const row = csvData.data[index]
            const amount = row.Amount || 0
            const isfraud = pred.prediction === 1
            const confidence = (pred.confidence * 100).toFixed(1)
            const riskLevel = this.getRiskLevel(pred.confidence, pred.prediction)
            
            tableHTML += `
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${index + 1}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">$${amount.toFixed(2)}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 text-xs font-semibold rounded-full ${isfraud ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}">
                            ${isfraud ? 'Fraudulent' : 'Legitimate'}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${confidence}%</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 text-xs font-semibold rounded-full ${riskLevel.class}">
                            ${riskLevel.text}
                        </span>
                    </td>
                </tr>
            `
        })

        tableHTML += `
                    </tbody>
                </table>
            </div>
        `

        tableContainer.innerHTML = tableHTML
    }

    getRiskLevel(confidence, prediction) {
        if (prediction === 1) {
            if (confidence > 0.8) return { text: 'High Risk', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
            if (confidence > 0.6) return { text: 'Medium Risk', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' }
            return { text: 'Low Risk', class: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' }
        } else {
            return { text: 'Safe', class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' }
        }
    }

    async loadSampleData() {
        this.uiManager.showLoading(true)
        
        try {
            // Generate sample data
            const sampleData = this.generateSampleData()
            await this.processData(sampleData)
        } catch (error) {
            console.error('Error loading sample data:', error)
            this.uiManager.showError('Error loading sample data: ' + error.message)
        } finally {
            this.uiManager.showLoading(false)
        }
    }

    generateSampleData() {
        const headers = ['Time', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17', 'V18', 'V19', 'V20', 'V21', 'V22', 'V23', 'V24', 'V25', 'V26', 'V27', 'V28', 'Amount']
        const data = []

        for (let i = 0; i < 20; i++) {
            const row = {}
            headers.forEach(header => {
                if (header === 'Amount') {
                    row[header] = Math.random() * 1000 + 10
                } else if (header === 'Time') {
                    row[header] = Math.random() * 172800
                } else {
                    row[header] = (Math.random() - 0.5) * 4
                }
            })
            data.push(row)
        }

        return { headers, data }
    }
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, initializing app...')
        new App()
    })
} else {
    console.log('DOM already loaded, initializing app...')
    new App()
}