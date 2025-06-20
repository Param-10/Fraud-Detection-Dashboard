import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export class ChartManager {
    constructor() {
        this.pieChart = null
        this.confidenceChart = null
    }

    createPieChart(fraudulent, legitimate) {
        const ctx = document.getElementById('pie-chart').getContext('2d')
        
        if (this.pieChart) {
            this.pieChart.destroy()
        }

        const isDark = document.documentElement.classList.contains('dark')
        const textColor = isDark ? '#f3f4f6' : '#374151'

        this.pieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Legitimate', 'Fraudulent'],
                datasets: [{
                    data: [legitimate, fraudulent],
                    backgroundColor: [
                        '#10b981', // green
                        '#ef4444'  // red
                    ],
                    borderWidth: 2,
                    borderColor: isDark ? '#374151' : '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: textColor,
                            padding: 20,
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            }
        })
    }

    createConfidenceChart(predictions) {
        const ctx = document.getElementById('confidence-chart').getContext('2d')
        
        if (this.confidenceChart) {
            this.confidenceChart.destroy()
        }

        // Create confidence bins
        const bins = [0, 0.2, 0.4, 0.6, 0.8, 1.0]
        const binCounts = new Array(bins.length - 1).fill(0)
        const binLabels = ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%']

        predictions.forEach(pred => {
            const confidence = pred.confidence
            for (let i = 0; i < bins.length - 1; i++) {
                if (confidence >= bins[i] && confidence < bins[i + 1]) {
                    binCounts[i]++
                    break
                }
            }
        })

        const isDark = document.documentElement.classList.contains('dark')
        const textColor = isDark ? '#f3f4f6' : '#374151'

        this.confidenceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: binLabels,
                datasets: [{
                    label: 'Number of Transactions',
                    data: binCounts,
                    backgroundColor: '#3b82f6',
                    borderColor: '#2563eb',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColor
                        },
                        grid: {
                            color: isDark ? '#374151' : '#e5e7eb'
                        }
                    },
                    y: {
                        ticks: {
                            color: textColor
                        },
                        grid: {
                            color: isDark ? '#374151' : '#e5e7eb'
                        }
                    }
                }
            }
        })
    }
}