<template>
  <section class="w-full p-6">
    <div class="max-w-xl mx-auto text-center min-h-[calc(100vh-220px)] flex flex-col items-center justify-start pt-2">
      <div class="w-full flex flex-col items-center justify-start">
        <!-- Avatar with concentric rings -->
        <div class="relative mb-10">
          <div class="relative w-48 h-48 rounded-full bg-white flex items-center justify-center">
            <!-- rings -->
            <span class="absolute inset-0 rounded-full ring-4 pulse-ring pulse-1" :class="ringOuterClass"></span>
            <span class="absolute -inset-2 rounded-full ring-4 pulse-ring pulse-2" :class="ringMiddleClass"></span>
            <span class="absolute -inset-4 rounded-full ring-4 pulse-ring pulse-3" :class="ringInnerClass"></span>
            <!-- avatar circle -->
            <div class="w-44 h-44 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              <img 
                :src="professorData.avatarUrl" 
                :alt="`Profile of ${professorData.firstName} ${professorData.lastName}`" 
                class="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>

        <!-- Greeting -->
        <div class="text-xl md:text-2xl font-semibold text-gray-900 mb-16">
          Good day, {{ professorData.title || 'Prof' }} {{ professorData.lastName }}! You're <span :class="statusColorClass">{{ statusText }}</span>.
        </div>

        <!-- Question -->
        <div class="text-sm md:text-base text-gray-600 mb-3">Want to change your status?</div>

        <!-- Status tiles -->
        <div class="flex gap-3 mt-1">
          <!-- Available -->
          <button
            @click="set('available')"
            class="w-32 h-24 rounded-2xl flex flex-col items-center justify-center border-2 tile-3d transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            :class="tileClass('available')"
          >
            <div class="w-10 h-10 rounded-full flex items-center justify-center badge-emboss" :class="iconBadgeClass('available')">
              <img src="/available.svg" alt="Available"/>
            </div>
            <div class="mt-2 text-sm font-medium" :class="labelColorClass('available')">Available</div>
          </button>

          <!-- Busy -->
          <button
            @click="set('busy')"
            class="w-32 h-24 rounded-2xl flex flex-col items-center justify-center border-2 tile-3d transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            :class="tileClass('busy')"
          >
            <div class="w-10 h-10 rounded-full flex items-center justify-center badge-emboss" :class="iconBadgeClass('busy')">
              <img src="/busy.svg" alt="Busy"/>
            </div>
            <div class="mt-2 text-sm font-medium" :class="labelColorClass('busy')">Busy</div>
          </button>

          <!-- Not Available -->
          <button
            @click="set('not_available')"
            class="w-32 h-24 rounded-2xl flex flex-col items-center justify-center border-2 tile-3d transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            :class="tileClass('not_available')"
          >
            <div class="w-10 h-10 rounded-full flex items-center justify-center badge-emboss" :class="iconBadgeClass('not_available')">
              <img src="/notavailable.svg" alt="Not Available"/>
            </div>
            <div class="mt-2 text-sm font-medium" :class="labelColorClass('not_available')">Not Available</div>
          </button>
        </div>
      </div>

      <!-- Footer info row pinned to bottom area -->
      <div class="w-full flex items-center justify-between text-[11px] text-gray-400 mt-auto pt-6">
        <div>Last Update : {{ lastUpdate }}</div>
        <div>Source: {{ lastUpdateSource }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/utils/api'

const router = useRouter()
const status = ref('available')
const professorData = ref({
  firstName: '',
  lastName: '',
  title: 'Prof',
  avatarUrl: '',
  idNumber: '',
  lastStatusChange: null,
  status: 'available'
})
const lastUpdateSource = ref('Manual')
const lastUpdate = ref('Loading...')
const isLoading = ref(true)
const professorId = ref(null)
const professorUid = ref(null)
const pollInterval = ref(null) // Added for polling

// Get professor data from localStorage
const getProfessorData = () => {
  try {
    // Get the professor object from localStorage
    const professorData = localStorage.getItem('professor') || 
                          localStorage.getItem('user') || 
                          localStorage.getItem('currentUser')
    
    if (!professorData) {
      console.error('No professor data found in localStorage')
      alert('Please log in to access your profile.')
      router.push('/auth/login')
      return null
    }

    // Parse the professor data
    const professor = JSON.parse(professorData)
    console.log('Professor data from localStorage:', professor)

    // Check if it's a professor and has an ID
    if (!professor.id) {
      console.error('Professor data does not contain an ID')
      alert('Invalid user data. Please log in again.')
      router.push('/auth/login')
      return null
    }

    if (professor.role !== 'professor') {
      console.error('User is not a professor, role:', professor.role)
      alert('Access denied. Professor account required.')
      router.push('/auth/login')
      return null
    }

    professorId.value = professor.id
    professorUid.value = professor.idNumber // Get the UID (RFID number)
    console.log('Professor ID found:', professorId.value)
    console.log('Professor UID found:', professorUid.value)
    
    return professor
  } catch (error) {
    console.error('Error parsing professor data from localStorage:', error)
    alert('Error reading user data. Please log in again.')
    router.push('/auth/login')
    return null
  }
}

// ==============================
// 🔹 Polling Functions (NEW)
// ==============================
const startPolling = () => {
  // Clear any existing interval
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
  }
  
  // Start new polling interval (2000ms = 2 seconds)
  pollInterval.value = setInterval(fetchProfessorData, 2000)
  console.log('🔄 Started polling professor status every 2 seconds')
}

const stopPolling = () => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
    pollInterval.value = null
    console.log('🛑 Stopped polling professor status')
  }
}

// Fetch last update from rfid_logs
const fetchLastUpdate = async () => {
  try {
    if (!professorUid.value) {
      console.error('No professor UID available')
      return
    }

    const response = await api.get(`/professors/last-update/${professorUid.value}`)
    if (response.data.success) {
      const lastUpdateData = response.data.data
      
      if (lastUpdateData) {
        // Format the timestamp
        lastUpdate.value = formatDateTime(new Date(lastUpdateData.timestamp))
        
        // Set source based on method
        if (lastUpdateData.method === 'rfid_tap') {
          lastUpdateSource.value = 'RFID'
        } else if (lastUpdateData.method === 'manual') {
          lastUpdateSource.value = 'Manual'
        } else {
          lastUpdateSource.value = lastUpdateData.method || 'Unknown'
        }
        
        console.log('✅ Last update data loaded:', lastUpdateData)
      }
    }
  } catch (error) {
    console.error('❌ Error fetching last update:', error)
    // Set default values if fetch fails
    lastUpdate.value = formatDateTime(new Date())
    lastUpdateSource.value = 'Manual'
  }
}

// Fetch professor data on component mount
const fetchProfessorData = async () => {
  try {
    // Get professor ID from localStorage
    const localProfessorData = getProfessorData()
    if (!localProfessorData || !professorId.value) {
      console.error('No professor ID available')
      return
    }
    
    const response = await api.get(`/professors/${professorId.value}`)
    if (response.data.success) {
      professorData.value = response.data.professor
      status.value = professorData.value.status || 'available'
      
      // After loading professor data, fetch the last update info
      await fetchLastUpdate()
      
      console.log('🔄 Polled professor status:', professorData.value.status)
    }
  } catch (error) {
    console.error('❌ Error fetching professor data:', error)
  }
}

// Initial data load with loading state
const initializeData = async () => {
  try {
    isLoading.value = true
    await fetchProfessorData()
  } finally {
    isLoading.value = false
  }
}

const updateStatus = async (newStatus) => {
  try {
    const localProfessorData = getProfessorData()
    if (!localProfessorData || !professorId.value) {
      console.error('No professor ID available')
      return
    }

    // Convert frontend status values to backend expected values
    const backendStatus = newStatus === 'not_available' ? 'not-available' : newStatus

    const response = await api.put(`/professors/${professorId.value}/status`, {
      status: backendStatus,
      method: 'manual'
    })
    
    if (response.data.success) {
      console.log(`✅ Status updated to ${newStatus}`)
      
      // Update local professor data with the response
      if (response.data.data && response.data.data.professor) {
        professorData.value.status = newStatus
        professorData.value.lastStatusChange = response.data.data.timestamp
        
        // Update last update info immediately after successful update
        lastUpdate.value = formatDateTime(new Date())
        lastUpdateSource.value = 'Manual'
      }
    } else {
      console.error('❌ Failed to update status:', response.data.message)
      // Revert the status change on failure
      status.value = professorData.value.status
    }
  } catch (error) {
    console.error('❌ Error updating status:', error)
    // Revert the status change on error
    status.value = professorData.value.status
  }
}

const set = async (val) => {
  const previousStatus = status.value
  status.value = val
  
  // Call the API to update the status in the backend
  await updateStatus(val)
}

const statusLabel = computed(() => {
  return status.value === 'available' ? 'AVAILABLE' : status.value === 'busy' ? 'BUSY' : 'NOT AVAILABLE'
})

const statusColorClass = computed(() => {
  if (status.value === 'available') return 'text-green-600'
  if (status.value === 'busy') return 'text-yellow-400'
  return 'text-red-500'
})

// Greeting text (Title Case)
const statusText = computed(() => {
  return status.value === 'available' ? 'Available' : status.value === 'busy' ? 'Busy' : 'Not Available'
})

// UI helpers for tiles (white background; active border = status color, inactive = gray-50)
const tileClass = (t) => {
  const base = 'bg-white'
  const inactive = 'border-gray-50'
  
  // Highlight the button that matches the current status
  if (status.value === t) {
    if (t === 'available') return `${base} border-green-500 shadow-lg`
    if (t === 'busy') return `${base} border-amber-400 shadow-lg`
    if (t === 'not_available') return `${base} border-red-400 shadow-lg`
  }
  return `${base} ${inactive}`
}

const iconBadgeClass = (t) => {
  return 'bg-gray-100'
}

const iconColorClass = (t) => {
  const size = 'text-xl'
  if (status.value === t) return `text-white ${size}`
  if (t === 'available') return `text-green-600 ${size}`
  if (t === 'busy') return `text-yellow-500 ${size}`
  return `text-gray-500 ${size}`
}

const labelColorClass = (t) => {
  return 'text-gray-900'
}

const formatDateTime = (d) => {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yy = String(d.getFullYear()).slice(-2)
  let hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12
  const hh = String(hours).padStart(1, '0')
  return `${mm}/${dd}/${yy} | ${hh}:${minutes} ${ampm}`
}

// Ring color classes based on status
const ringOuterClass = computed(() => {
  if (status.value === 'available') return 'ring-green-200'
  if (status.value === 'busy') return 'ring-yellow-200'
  return 'ring-red-300'
})

const ringMiddleClass = computed(() => {
  if (status.value === 'available') return 'ring-green-100'
  if (status.value === 'busy') return 'ring-yellow-100'
  return 'ring-red-200'
})

const ringInnerClass = computed(() => {
  if (status.value === 'available') return 'ring-green-50'
  if (status.value === 'busy') return 'ring-yellow-50'
  return 'ring-red-100'
})

// Fetch professor data when component mounts
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

<style scoped>
@keyframes pulse-ring {
  0% { transform: scale(0.95); opacity: 0.6; }
  50% { transform: scale(1.05); opacity: 0.25; }
  100% { transform: scale(1); opacity: 0.1; }
}

.pulse-ring {
  animation: pulse-ring 2.4s ease-out infinite;
  will-change: transform, opacity;
}

.pulse-1 { animation-delay: 0s; }
.pulse-2 { animation-delay: 0.3s; }
.pulse-3 { animation-delay: 0.6s; }

/* 3D tile styling */
.tile-3d {
  background-image: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 8px 16px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.7) inset;
}
.tile-3d:hover {
  box-shadow: 0 12px 22px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.7) inset;
}
.tile-3d:active {
  box-shadow: 0 4px 10px rgba(0,0,0,0.08), 0 2px 0 rgba(0,0,0,0.06) inset;
}

/* Embossed circular badge behind the SVG */
.badge-emboss {
  box-shadow: inset 0 2px 6px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.9);
}
</style>