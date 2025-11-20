<template>
  <div class="w-full h-full flex flex-col items-center p-2">
    <div class="flex flex-col items-center w-full p-2 sm:p-4 text-white">
      <h2 class="text-base font-semibold">Professor Availability</h2>
      <span class="text-xs font-medium text-white/80 mb-8">{{ currentDay }}</span>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center h-72">
        <div class="text-white">Loading availability data...</div>
      </div>

      <!-- No Data State -->
      <div v-else-if="Object.keys(hourlyData).length === 0" class="flex items-center justify-center h-72">
        <div class="text-white text-center">
          <div>No availability data found</div>
          <div class="text-xs mt-2">Check if professors have schedules set up</div>
        </div>
      </div>

      <!-- Chart Container with relative positioning -->
      <div v-else class="relative flex flex-col w-full mt-2">
        <!-- Current Time Indicator Line - Positioned absolutely within chart container -->
        <div 
          v-if="hasCurrentTimeData"
          class="absolute top-0 bottom-8 pointer-events-none z-20"
          :style="{ left: `${getCurrentTimePosition()}%` }"
        >
          <div class="flex flex-col items-center h-full">
            <!-- "Now" label -->
            <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-red-300 font-semibold whitespace-nowrap bg-red-500/20 px-2 py-1 rounded">
              Now {{ formatCurrentTime() }}
            </div>
            <!-- Red line -->
            <div class="w-0.5 h-full bg-red-500 rounded-full"></div>
            <!-- Red dot at bottom -->
            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
        </div>

        <!-- Chart Bars -->
        <div class="flex items-end flex-grow w-full space-x-1 sm:space-x-2">
          <div 
            v-for="hour in chartHours" 
            :key="hour"
            class="relative flex flex-col items-center flex-grow pb-5 group"
          >
            <!-- Tooltip with data source info -->
            <div class="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-52 rounded-lg bg-indigo-900 text-white shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              <div class="text-sm font-semibold">{{ formatHour(hour) }}</div>
              <div class="text-xs text-white/80 mb-1">{{ getData(hour).total }} Professors</div>
              <div class="text-[10px] text-indigo-300 mb-2">
                {{ getDataSource(hour) }}
              </div>
              <div class="mt-1 space-y-1 text-xs">
                <div class="flex items-center gap-2">
                  <span class="inline-block h-3 w-3 rounded-sm bg-indigo-400"></span>
                  <span>{{ getData(hour).available }} Available ({{ Math.round((getData(hour).available / getData(hour).total) * 100) }}%)</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="inline-block h-3 w-3 rounded-sm bg-indigo-300"></span>
                  <span>{{ getData(hour).busy }} Busy ({{ Math.round((getData(hour).busy / getData(hour).total) * 100) }}%)</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="inline-block h-3 w-3 rounded-sm bg-indigo-200"></span>
                  <span>{{ getData(hour).notAvailable }} Not Available ({{ Math.round((getData(hour).notAvailable / getData(hour).total) * 100) }}%)</span>
                </div>
              </div>
            </div>

            <!-- Chart Bars Container -->
            <div class="w-full flex flex-col justify-end h-32 min-h-[80px] bg-indigo-900/20 rounded-t">
              <!-- Available Bar -->
              <div 
                v-if="getData(hour).available > 0"
                class="relative flex justify-center w-full bg-indigo-400 transition-all duration-300 hover:bg-indigo-300"
                :style="{ height: `${getBarHeight(getData(hour).available, getData(hour).total)}%` }"
                :title="`${getData(hour).available} Available`"
              ></div>
              
              <!-- Busy Bar -->
              <div 
                v-if="getData(hour).busy > 0"
                class="relative flex justify-center w-full bg-indigo-300 transition-all duration-300 hover:bg-indigo-200"
                :style="{ height: `${getBarHeight(getData(hour).busy, getData(hour).total)}%` }"
                :title="`${getData(hour).busy} Busy`"
              ></div>
              
              <!-- Not Available Bar -->
              <div 
                v-if="getData(hour).notAvailable > 0"
                class="relative flex justify-center w-full bg-indigo-200 transition-all duration-300 hover:bg-indigo-100"
                :style="{ height: `${getBarHeight(getData(hour).notAvailable, getData(hour).total)}%` }"
                :title="`${getData(hour).notAvailable} Not Available`"
              ></div>
            </div>

            <!-- Time Label -->
            <span class="absolute bottom-0 text-[10px] font-semibold whitespace-nowrap">
              {{ formatHourLabel(hour) }}
            </span>

            <!-- Current Hour Indicator (small dot on the bar) -->
            <div 
              v-if="isCurrentHour(hour)"
              class="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse z-10"
            ></div>
          </div>
        </div>
      </div>

      <!-- Data Source Info -->
      <div class="mt-4 text-xs text-white/70 text-center">
        <div>Data based on professor schedules and real-time status</div>
        <div v-if="isWeekend" class="text-yellow-300 mt-1">Weekend: All professors marked as Not Available</div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import api from '@/utils/api'

const loading = ref(true)
const hourlyData = ref({})
const currentDay = ref('')
const currentHour = ref(0)
const currentMinute = ref(0)
const isWeekend = ref(false)
const dataSource = ref('api') // 'api' or 'fallback'
const pollInterval = ref(null)

// Chart hours: 7 AM to 6 PM (12 hours total) - Philippine Time
const CHART_START_HOUR = 7
const CHART_END_HOUR = 18
const TOTAL_HOURS = CHART_END_HOUR - CHART_START_HOUR + 1

// Predefined chart hours to ensure 7 AM to 6 PM display
const chartHours = computed(() => {
  return Array.from({ length: TOTAL_HOURS }, (_, i) => i + CHART_START_HOUR)
})

// Get Philippine time (UTC+8)
const getPhilippineTime = () => {
  const now = new Date()
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
  const phTime = new Date(utc + (8 * 3600000))
  return {
    hour: phTime.getHours(),
    minute: phTime.getMinutes(),
    day: phTime.toLocaleDateString('en-US', { weekday: 'long' }),
    isWeekend: phTime.getDay() === 0 || phTime.getDay() === 6
  }
}

const formatHour = (hour) => {
  if (hour === 12) return '12 PM'
  if (hour === 0 || hour === 24) return '12 AM'
  return hour >= 12 ? `${hour === 12 ? 12 : hour - 12} PM` : `${hour} AM`
}

const formatHourLabel = (hour) => {
  const keyHours = [7, 12, 18] // 7 AM, 12 PM, 6 PM
  if (keyHours.includes(hour)) {
    return formatHour(hour)
  }
  return `${hour > 12 ? hour - 12 : hour}`
}

const formatCurrentTime = () => {
  const phTime = getPhilippineTime()
  return `${phTime.hour.toString().padStart(2, '0')}:${phTime.minute.toString().padStart(2, '0')}`
}

// Get data source information for tooltip
const getDataSource = (hour) => {
  if (dataSource.value === 'fallback') {
    return 'Sample data (API unavailable)'
  }
  return 'Live schedule data'
}

// Get data for a specific hour, with fallback
const getData = (hour) => {
  return hourlyData.value[hour] || { available: 0, busy: 0, notAvailable: 0, total: 0 }
}

const hasCurrentTimeData = computed(() => {
  const phTime = getPhilippineTime()
  return phTime.hour >= CHART_START_HOUR && phTime.hour <= CHART_END_HOUR
})

const getBarHeight = (value, total) => {
  if (total === 0) return 0
  const percentage = (value / total) * 100
  return Math.max(percentage, 2)
}

const isCurrentHour = (hour) => {
  const phTime = getPhilippineTime()
  return hour === phTime.hour
}

const getCurrentTimePosition = () => {
  if (!hasCurrentTimeData.value) return 0
  
  const phTime = getPhilippineTime()
  const hourProgress = phTime.minute / 60
  const hourIndex = phTime.hour - CHART_START_HOUR
  const position = ((hourIndex + hourProgress) / TOTAL_HOURS) * 100
  
  return Math.max(0, Math.min(100, position))
}

const fetchAvailabilityData = async () => {
  try {
    const response = await api.get('/dashboard/professors/availability')
    
    if (response.data.success) {
      dataSource.value = 'api'
      hourlyData.value = response.data.data.hourlyData || {}
      isWeekend.value = response.data.data.isWeekend || false
      
      // Update with Philippine time
      const phTime = getPhilippineTime()
      currentHour.value = phTime.hour
      currentMinute.value = phTime.minute
      currentDay.value = phTime.day
      
      console.log('📊 API Data received:', hourlyData.value)
      console.log('📅 Is weekend:', isWeekend.value)
    } else {
      throw new Error('API returned success: false')
    }
  } catch (error) {
    console.error('Error fetching availability data:', error)
    // Fallback data commented out as in original
  }
}

const startPolling = () => {
  // Clear any existing interval
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
  }
  
  // Start new polling interval (2000ms = 2 seconds)
  pollInterval.value = setInterval(fetchAvailabilityData, 2000)
}

const stopPolling = () => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
    pollInterval.value = null
  }
}

// Initial data load with loading state
const initializeData = async () => {
  try {
    loading.value = true
    await fetchAvailabilityData()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  initializeData().then(() => {
    // Start polling after initial load is complete
    startPolling()
  })
})

onUnmounted(() => {
  // Clean up interval when component is destroyed
  stopPolling()
})
</script>