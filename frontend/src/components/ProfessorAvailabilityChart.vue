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
      <h2 class="text-base font-semibold">Professor Availability</h2>
      <span class="text-xs font-medium text-white/80 mb-8">{{ currentDay }}</span>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center h-72">
        <div class="text-white">Loading availability data...</div>
      </div>

      <!-- Chart -->
      <div v-else class="flex items-end flex-grow w-full mt-2 space-x-1 sm:space-x-2">
        <div 
          v-for="(data, hour) in hourlyData" 
          :key="hour"
          class="relative flex flex-col items-center flex-grow pb-5 group"
        >
          <!-- Tooltip -->
          <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-44 rounded-lg bg-indigo-900 text-white shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <div class="text-sm font-semibold">{{ data.total }} PROFESSORS</div>
            <div class="mt-1 space-y-1 text-xs">
              <div class="flex items-center gap-2">
                <span class="inline-block h-3 w-3 rounded-sm bg-indigo-400"></span>
                <span>{{ data.available }} Available</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="inline-block h-3 w-3 rounded-sm bg-indigo-300"></span>
                <span>{{ data.busy }} Busy</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="inline-block h-3 w-3 rounded-sm bg-indigo-200"></span>
                <span>{{ data.notAvailable }} Not Available</span>
              </div>
            </div>
          </div>

          <!-- Chart Bars -->
          <div class="w-full flex flex-col justify-end h-32">
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

      <!-- Current Time Indicator -->
      <div 
        v-if="!loading && currentHour >= 8 && currentHour <= 20"
        class="absolute bottom-8 left-0 right-0 flex justify-center"
        :style="{ left: `${((currentHour - 8) / 13) * 100}%` }"
      >
        <div class="w-1 h-8 bg-red-500 rounded-full"></div>
        <div class="absolute -top-6 text-xs text-red-300 font-semibold whitespace-nowrap">
          Now
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/api'

const loading = ref(true)
const hourlyData = ref({})
const currentDay = ref('')
const currentHour = ref(0)

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
  
  // Refresh data every 5 minutes
  setInterval(fetchAvailabilityData, 5 * 60 * 1000)
})
</script>

<style scoped>
.group:hover .group-hover\:block {
  display: block;
}
</style>