<template>
  <div class="chart-container">
    <canvas 
      ref="chartCanvas" 
      class="chart-fade-in"
      :class="{ 'chart-visible': chartOpacity === 1 }"
      :style="{ opacity: chartOpacity }"
    ></canvas>
    <div v-if="!chartInstance" class="chart-loading">
      <p>Loading chart...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'

// Register all Chart.js components
Chart.register(...registerables)

const chartCanvas = ref(null)
const chartInstance = ref(null)
const chartOpacity = ref(0)

// Simple test data
const chartData = {
  labels: ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'],
  datasets: [
    {
      label: 'Available Professors',
      data: [12, 15, 18, 22, 25, 20, 18, 16, 14, 10],
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: 'rgba(59, 130, 246, 1)',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
    }
  ]
}

// Simple options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 5,
      bottom: 5,
      left: 5,
      right: 5
    }
  },
  animation: {
    duration: 2000,
    easing: 'easeInOutQuart',
    delay: (context) => {
      return context.dataIndex * 150
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: 'rgba(59, 130, 246, 0.8)',
      borderWidth: 2,
      cornerRadius: 8,
      padding: 10,
      titleFont: {
        family: 'Poppins, sans-serif',
        size: 13,
        weight: '600'
      },
      bodyFont: {
        family: 'Poppins, sans-serif',
        size: 12,
        weight: '400'
      },
      callbacks: {
        title: function(context) {
          return `${context[0].label}`
        },
        label: function(context) {
          return `Available: ${context.parsed.y} professors`
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#ffffff',
        font: {
          family: 'Poppins, sans-serif',
          size: 12,
          weight: '500'
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: '#ffffff',
        font: {
          family: 'Poppins, sans-serif',
          size: 12,
          weight: '500'
        }
      }
    }
  }
}

// Initialize chart
onMounted(() => {
  console.log('Chart component mounted')
  console.log('Canvas element:', chartCanvas.value)
  console.log('Chart.js available:', typeof Chart)
  
  setTimeout(() => {
    if (chartCanvas.value) {
      try {
        console.log('Creating simple chart...')
        
        chartInstance.value = new Chart(chartCanvas.value, {
          type: 'line',
          data: chartData,
          options: chartOptions
        })
        
        console.log('Chart created successfully:', chartInstance.value)
        
        // Trigger fade-in animation
        setTimeout(() => {
          chartOpacity.value = 1
        }, 100)
      } catch (error) {
        console.error('Error creating chart:', error)
        console.error('Error details:', error.message)
      }
    } else {
      console.error('Canvas element not found')
    }
  }, 200)
})
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 100%;
  width: 100%;
  max-height: 240px;
  overflow: hidden;
}

.chart-fade-in {
  width: 100%;
  height: 100%;
  max-height: 240px;
  transition: opacity 1.5s ease-in-out, transform 1.5s ease-in-out;
  transform: translateY(20px);
}

.chart-visible {
  transform: translateY(0);
}

.chart-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 500;
}
</style>