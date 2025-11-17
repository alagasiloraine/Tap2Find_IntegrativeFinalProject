<!-- <template>
  <div class="w-full h-full flex flex-col items-center p-2">
    <div class="flex flex-col items-center w-full p-2 sm:p-4 text-white relative">
      <h2 class="text-base font-semibold">Professor Availability</h2>
      <span class="text-xs font-medium text-white/80 mb-8">Today</span>
      <div class="flex items-end flex-grow w-full mt-2 space-x-1 sm:space-x-2">
        <div class="relative flex flex-col items-center flex-grow pb-5 group">
          <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-44 rounded-lg bg-indigo-900 text-white shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="text-sm font-semibold">22 PROFESSOR</div>
            <div class="mt-1 space-y-1 text-xs">
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-400"></span><span>12 Available</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-300"></span><span>4 Busy</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-200"></span><span>6 Not Available</span></div>
            </div>
          </div>
          <div class="relative flex justify-center w-full h-6 bg-indigo-200" title="Not Available"></div>
          <div class="relative flex justify-center w-full h-4 bg-indigo-300" title="Busy"></div>
          <div class="relative flex justify-center w-full h-12 bg-indigo-400" title="Available"></div>
          <span class="absolute bottom-0 text-[10px] font-semibold">8 AM</span>
        </div>
        <div class="relative flex flex-col items-center flex-grow pb-5 group">
          <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-44 rounded-lg bg-indigo-900 text-white shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="text-sm font-semibold">28 PROFESSOR</div>
            <div class="mt-1 space-y-1 text-xs">
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-400"></span><span>16 Available</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-300"></span><span>4 Busy</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-200"></span><span>8 Not Available</span></div>
            </div>
          </div>
          <div class="relative flex justify-center w-full h-8 bg-indigo-200" title="Not Available"></div>
          <div class="relative flex justify-center w-full h-4 bg-indigo-300" title="Busy"></div>
          <div class="relative flex justify-center w-full h-16 bg-indigo-400" title="Available"></div>
          <span class="absolute bottom-0 text-[10px] font-semibold">9 AM</span>
        </div>
        <div class="relative flex flex-col items-center flex-grow pb-5 group">
          <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-44 rounded-lg bg-indigo-900 text-white shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="text-sm font-semibold">30 PROFESSOR</div>
            <div class="mt-1 space-y-1 text-xs">
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-400"></span><span>16 Available</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-300"></span><span>6 Busy</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-200"></span><span>8 Not Available</span></div>
            </div>
          </div>
          <div class="relative flex justify-center w-full h-8 bg-indigo-200" title="Not Available"></div>
          <div class="relative flex justify-center w-full h-6 bg-indigo-300" title="Busy"></div>
          <div class="relative flex justify-center w-full h-16 bg-indigo-400" title="Available"></div>
          <span class="absolute bottom-0 text-[10px] font-semibold">10 AM</span>
        </div>
        <div class="relative flex flex-col items-center flex-grow pb-5 group">
          <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-44 rounded-lg bg-indigo-900 text-white shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="text-sm font-semibold">32 PROFESSOR</div>
            <div class="mt-1 space-y-1 text-xs">
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-400"></span><span>20 Available</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-300"></span><span>4 Busy</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-200"></span><span>8 Not Available</span></div>
            </div>
          </div>
          <div class="relative flex justify-center w-full h-8 bg-indigo-200" title="Not Available"></div>
          <div class="relative flex justify-center w-full h-4 bg-indigo-300" title="Busy"></div>
          <div class="relative flex justify-center w-full h-20 bg-indigo-400" title="Available"></div>
          <span class="absolute bottom-0 text-[10px] font-semibold">11 AM</span>
        </div>
        <div class="relative flex flex-col items-center flex-grow pb-5 group">
          <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-44 rounded-lg bg-indigo-900 text-white shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="text-sm font-semibold">40 PROFESSOR</div>
            <div class="mt-1 space-y-1 text-xs">
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-400"></span><span>24 Available</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-300"></span><span>6 Busy</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-200"></span><span>10 Not Available</span></div>
            </div>
          </div>
          <div class="relative flex justify-center w-full h-10 bg-indigo-200" title="Not Available"></div>
          <div class="relative flex justify-center w-full h-6 bg-indigo-300" title="Busy"></div>
          <div class="relative flex justify-center w-full h-24 bg-indigo-400" title="Available"></div>
          <span class="absolute bottom-0 text-[10px] font-semibold">12 PM</span>
        </div>
        <div class="relative flex flex-col items-center flex-grow pb-5 group">
          <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-44 rounded-lg bg-indigo-900 text-white shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="text-sm font-semibold">34 PROFESSOR</div>
            <div class="mt-1 space-y-1 text-xs">
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-400"></span><span>16 Available</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-300"></span><span>8 Busy</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-200"></span><span>10 Not Available</span></div>
            </div>
          </div>
          <div class="relative flex justify-center w-full h-10 bg-indigo-200" title="Not Available"></div>
          <div class="relative flex justify-center w-full h-8 bg-indigo-300" title="Busy"></div>
          <div class="relative flex justify-center w-full h-16 bg-indigo-400" title="Available"></div>
          <span class="absolute bottom-0 text-[10px] font-semibold">1 PM</span>
        </div>
        <div class="relative flex flex-col items-center flex-grow pb-5 group">
          <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-44 rounded-lg bg-indigo-900 text-white shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="text-sm font-semibold">30 PROFESSOR</div>
            <div class="mt-1 space-y-1 text-xs">
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-400"></span><span>16 Available</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-300"></span><span>6 Busy</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-200"></span><span>8 Not Available</span></div>
            </div>
          </div>
          <div class="relative flex justify-center w-full h-8 bg-indigo-200" title="Not Available"></div>
          <div class="relative flex justify-center w-full h-6 bg-indigo-300" title="Busy"></div>
          <div class="relative flex justify-center w-full h-16 bg-indigo-400" title="Available"></div>
          <span class="absolute bottom-0 text-[10px] font-semibold">2 PM</span>
        </div>
        <div class="relative flex flex-col items-center flex-grow pb-5 group">
          <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-44 rounded-lg bg-indigo-900 text-white shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="text-sm font-semibold">28 PROFESSOR</div>
            <div class="mt-1 space-y-1 text-xs">
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-400"></span><span>16 Available</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-300"></span><span>6 Busy</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-200"></span><span>6 Not Available</span></div>
            </div>
          </div>
          <div class="relative flex justify-center w-full h-6 bg-indigo-200" title="Not Available"></div>
          <div class="relative flex justify-center w-full h-6 bg-indigo-300" title="Busy"></div>
          <div class="relative flex justify-center w-full h-16 bg-indigo-400" title="Available"></div>
          <span class="absolute bottom-0 text-[10px] font-semibold">3 PM</span>
        </div>
        <div class="relative flex flex-col items-center flex-grow pb-5 group">
          <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-44 rounded-lg bg-indigo-900 text-white shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="text-sm font-semibold">22 PROFESSOR</div>
            <div class="mt-1 space-y-1 text-xs">
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-400"></span><span>12 Available</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-300"></span><span>4 Busy</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-200"></span><span>6 Not Available</span></div>
            </div>
          </div>
          <div class="relative flex justify-center w-full h-6 bg-indigo-200" title="Not Available"></div>
          <div class="relative flex justify-center w-full h-4 bg-indigo-300" title="Busy"></div>
          <div class="relative flex justify-center w-full h-12 bg-indigo-400" title="Available"></div>
          <span class="absolute bottom-0 text-[10px] font-semibold">4 PM</span>
        </div>
        <div class="relative flex flex-col items-center flex-grow pb-5 group">
          <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-44 rounded-lg bg-indigo-900 text-white shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="text-sm font-semibold">18 PROFESSOR</div>
            <div class="mt-1 space-y-1 text-xs">
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-400"></span><span>10 Available</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-300"></span><span>4 Busy</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-200"></span><span>4 Not Available</span></div>
            </div>
          </div>
          <div class="relative flex justify-center w-full h-4 bg-indigo-200" title="Not Available"></div>
          <div class="relative flex justify-center w-full h-4 bg-indigo-300" title="Busy"></div>
          <div class="relative flex justify-center w-full h-10 bg-indigo-400" title="Available"></div>
          <span class="absolute bottom-0 text-[10px] font-semibold">5 PM</span>
        </div>
        <div class="relative flex flex-col items-center flex-grow pb-5 group">
          <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-44 rounded-lg bg-indigo-900 text-white shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="text-sm font-semibold">20 PROFESSOR</div>
            <div class="mt-1 space-y-1 text-xs">
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-400"></span><span>12 Available</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-300"></span><span>4 Busy</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-200"></span><span>4 Not Available</span></div>
            </div>
          </div>
          <div class="relative flex justify-center w-full h-4 bg-indigo-200" title="Not Available"></div>
          <div class="relative flex justify-center w-full h-4 bg-indigo-300" title="Busy"></div>
          <div class="relative flex justify-center w-full h-12 bg-indigo-400" title="Available"></div>
          <span class="absolute bottom-0 text-[10px] font-semibold">6 PM</span>
        </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
// Design-only static chart markup
</script>

<style scoped>
.group:hover .group-hover\:block {
  display: block;
}
</style> -->

<template>
  <div class="w-full h-full flex flex-col items-center p-2">
    <div class="flex flex-col items-center w-full p-2 sm:p-4 text-white relative">
      <!-- Reserve vertical space so bars never crowd the headings on small screens -->
      <div class="w-full text-center leading-tight mb-3 sm:mb-6 md:mb-8 h-12 sm:h-14 md:h-16 flex flex-col items-center justify-center">
        <h2 class="text-xs sm:text-sm md:text-base font-semibold">Professor Availability</h2>
        <span class="block text-[10px] sm:text-xs font-medium text-white/80 mt-0.5">{{ currentDay }}</span>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center h-72">
        <div class="text-white">Loading availability data...</div>
      </div>

      <!-- Chart -->
      <div v-else class="relative z-10 w-full overflow-x-auto md:overflow-visible overflow-y-visible">
        <div class="relative flex items-end flex-grow w-[900px] md:w-full mt-2 sm:mt-3 space-x-1 sm:space-x-2">
          <!-- Current Time Indicator (desktop and up) positioned relative to bars row -->
          <div 
            v-if="!loading && isNowVisible"
            class="flex absolute bottom-5 left-0 -translate-x-1/2 z-[60] pointer-events-none"
            :style="{ left: nowLeftPercent + '%' }"
          >
            <div class="w-1 h-6 md:h-8 bg-red-500 rounded-full z-[60]"></div>
            <div class="absolute -top-6 text-xs text-red-300 font-semibold whitespace-nowrap z-[60]">
              Now
            </div>
          </div>
        <div 
          v-for="(data, hour) in hourlyData" 
          :key="hour"
          class="relative flex flex-col items-center flex-grow pb-5 group"
          @mouseenter="showTooltip($event, data)"
          @mousemove="moveTooltip($event)"
          @mouseleave="hideTooltip"
        >

          <!-- Chart Bars -->
          <div class="w-full flex flex-col justify-end h-28 sm:h-32 md:h-36">
            <!-- Not Available Bar -->
            <div 
              v-if="data.notAvailable > 0"
              class="relative flex justify-center w-full bg-indigo-200 transition-all duration-300"
              :style="{ height: `${(data.notAvailable / data.total) * 100}%` }"
              :title="`${data.notAvailable} Not Available`"
            ></div>
            
            <!-- Busy Bar -->
            <div 
              v-if="data.busy > 0"
              class="relative flex justify-center w-full bg-indigo-300 transition-all duration-300"
              :style="{ height: `${(data.busy / data.total) * 100}%` }"
              :title="`${data.busy} Busy`"
            ></div>
            
            <!-- Available Bar -->
            <div 
              v-if="data.available > 0"
              class="relative flex justify-center w-full bg-indigo-400 transition-all duration-300"
              :style="{ height: `${(data.available / data.total) * 100}%` }"
              :title="`${data.available} Available`"
            ></div>
          </div>

          <!-- Time Label -->
          <span class="absolute bottom-0 text-[10px] font-semibold">
            {{ formatHour(hour) }}
          </span>
        </div>
      </div>
      </div>
      
      
      
      <!-- Global tooltip portal inside template to avoid SFC parse issues -->
      <teleport to="body">
        <div v-if="tooltip.visible" class="pointer-events-none fixed z-[9999]" :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }">
          <div class="w-40 sm:w-44 rounded-lg bg-indigo-900 text-white shadow-lg px-3 py-2">
            <div class="text-sm font-semibold">{{ tooltip.data ? tooltip.data.total : '' }} PROFESSORS</div>
            <div class="mt-1 space-y-1 text-xs">
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-400"></span><span>{{ tooltip.data ? tooltip.data.available : '' }} Available</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-300"></span><span>{{ tooltip.data ? tooltip.data.busy : '' }} Busy</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-200"></span><span>{{ tooltip.data ? tooltip.data.notAvailable : '' }} Not Available</span></div>
            </div>
          </div>
        </div>
      </teleport>
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

// Keep the 'Now' indicator realtime with minute precision
let nowTicker = null
const updateCurrentHour = () => {
  const d = new Date()
  currentHour.value = d.getHours() + d.getMinutes() / 60
}
updateCurrentHour()

// Tooltip state rendered via Teleport to body (prevents clipping/overlap)
const tooltip = ref({ visible: false, x: 0, y: 0, data: null })

// Compute hour range from data to position 'Now' accurately at column centers
const hoursRange = computed(() => {
  const keys = Object.keys(hourlyData.value || {}).map((n) => parseInt(n, 10)).filter((n) => !Number.isNaN(n)).sort((a, b) => a - b)
  const min = keys.length ? keys[0] : 0
  const max = keys.length ? keys[keys.length - 1] : 0
  const count = keys.length || 1
  return { min, max, count }
})

const nowLeftPercent = computed(() => {
  const { min, count } = hoursRange.value
  // position at the center of the current hour column, include minute fraction
  const pos = ((currentHour.value - min) + 0.5) / count
  const clamped = Math.max(0, Math.min(1, pos))
  return clamped * 100
})

const isToday = computed(() => {
  try {
    const today = new Date().toLocaleDateString(undefined, { weekday: 'long' })
    return (currentDay.value || '').toLowerCase() === today.toLowerCase()
  } catch (e) {
    return true
  }
})

const isNowVisible = computed(() => {
  const { min, max } = hoursRange.value
  return isToday.value && currentHour.value >= min && currentHour.value <= (max + 1)
})

const showTooltip = (evt, data) => {
  tooltip.value.data = data
  tooltip.value.visible = true
  moveTooltip(evt)
}

const moveTooltip = (evt) => {
  if (!tooltip.value.visible) return
  const offset = 12
  tooltip.value.x = evt.clientX + offset
  tooltip.value.y = evt.clientY - 80
}

const hideTooltip = () => {
  tooltip.value.visible = false
}

const formatHour = (hour) => {
  if (hour === 12) return '12 PM'
  if (hour === 24) return '12 AM'
  return hour > 12 ? `${hour - 12} PM` : `${hour} AM`
}

const fetchAvailabilityData = async () => {
  try {
    loading.value = true
    const response = await api.get('/dashboard/professors/availability')
    
    if (response.data.success) {
      hourlyData.value = response.data.data.hourlyData
      currentDay.value = response.data.data.currentDay
      currentHour.value = response.data.data.currentHour
    }
  } catch (error) {
    console.error('Error fetching availability data:', error)
    // Fallback to sample data if API fails
    hourlyData.value = generateSampleData()
    currentDay.value = new Date().toLocaleDateString('en-US', { weekday: 'long' })
    currentHour.value = new Date().getHours()
  } finally {
    loading.value = false
  }
}

// Fallback sample data generator
const generateSampleData = () => {
  const hours = Array.from({ length: 13 }, (_, i) => i + 8)
  const data = {}
  
  hours.forEach(hour => {
    const total = 40 + Math.floor(Math.random() * 10)
    const available = Math.floor(total * (0.4 + Math.random() * 0.3))
    const busy = Math.floor(total * (0.2 + Math.random() * 0.2))
    const notAvailable = total - available - busy
    
    data[hour] = { available, busy, notAvailable, total }
  })
  
  return data
}

onMounted(() => {
  fetchAvailabilityData()
  // start realtime ticker for 'Now' indicator (update every 30s)
  nowTicker = setInterval(updateCurrentHour, 30 * 1000)
  
  // Refresh data every 5 minutes
  setInterval(fetchAvailabilityData, 5 * 60 * 1000)
})

onUnmounted(() => {
  if (nowTicker) clearInterval(nowTicker)
})
</script>
<style scoped>
.group:hover .group-hover\:block {
  display: block;
}
</style>