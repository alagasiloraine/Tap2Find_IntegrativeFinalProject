<template>
  <section class="w-full p-6">
    <div class="max-w-md mx-auto text-center min-h-[calc(100vh-220px)] flex flex-col items-center justify-start">
      <div class="w-full">
        <!-- Current Status Card -->
        <div
          class="relative overflow-hidden rounded-2xl px-6 py-7 text-2xl font-bold tracking-wide text-white shadow-lg ring-1 ring-white/10"
          :class="statusGradientClass"
        >
          <div class="absolute inset-0 pointer-events-none">
            <div class="absolute -top-10 -left-10 w-36 h-36 rounded-full bg-white/10 blur-2xl"></div>
            <div class="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-white/10 blur-2xl"></div>
          </div>
          <div class="relative">{{ currentStatusDisplay }}</div>
        </div>

        <!-- Last Update Cards -->
        <div class="mt-4 grid grid-cols-2 gap-3">
          <div class="bg-gray-500 text-white rounded-xl px-5 py-4 shadow-sm">
            <div class="text-base font-semibold">Last RFID Tap</div>
            <div class="text-xs opacity-90">{{ lastRfidTap || 'No RFID tap recorded' }}</div>
          </div>
          <div class="bg-gray-400 text-white rounded-xl px-5 py-4 shadow-sm">
            <div class="text-base font-semibold">Manual Updates</div>
            <div class="text-xs opacity-90">{{ lastManualUpdate || 'No manual updates' }}</div>
          </div>
        </div>

        <!-- Notification History -->
        <div class="mt-8 text-left">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Notification History</h2>
          <ul class="space-y-2" v-if="notificationHistory.length > 0">
            <li 
              v-for="(notification, index) in notificationHistory" 
              :key="index"
              class="rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 bg-white"
            >
              <div class="font-medium">{{ formatDisplayDate(notification.timestamp) }}</div>
              <div class="opacity-80">{{ getNotificationMessage(notification) }}</div>
            </li>
          </ul>
          <div v-else class="text-center py-4 text-gray-500">
            No status history available
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/utils/api'

const router = useRouter()

// Reactive data
const currentStatus = ref('')
const lastRfidTap = ref('')
const lastManualUpdate = ref('')
const notificationHistory = ref([])
const professorUid = ref('')
const isLoading = ref(true)
const pollInterval = ref(null) // Added for polling

// Get professor data from localStorage
const getProfessorData = () => {
  try {
    const professorData = localStorage.getItem('professor') || 
                          localStorage.getItem('user') || 
                          localStorage.getItem('currentUser')
    
    if (!professorData) {
      console.error('No professor data found in localStorage')
      alert('Please log in to access your profile.')
      router.push('/auth/login')
      return null
    }

    const professor = JSON.parse(professorData)
    console.log('Professor data from localStorage:', professor)

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

    professorUid.value = professor.idNumber
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
  pollInterval.value = setInterval(fetchAllData, 2000)
  console.log('🔄 Started polling status history every 2 seconds')
}

const stopPolling = () => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
    pollInterval.value = null
    console.log('🛑 Stopped polling status history')
  }
}

const fetchAllData = async () => {
  await Promise.all([
    fetchCurrentStatus(),
    fetchStatusHistory()
  ])
}

// Fetch current status and profile data
const fetchCurrentStatus = async () => {
  try {
    const professorData = getProfessorData()
    if (!professorData || !professorUid.value) {
      console.error('No professor data available')
      return
    }

    // Fetch professor profile to get current status
    const response = await api.get(`/professors/${professorData.id}`)
    if (response.data.success) {
      currentStatus.value = response.data.professor.status || 'not-available'
      console.log('🔄 Polled current status:', currentStatus.value)
    }
  } catch (error) {
    console.error('❌ Error fetching current status:', error)
    currentStatus.value = 'not-available'
  }
}

// Fetch status history from rfid_logs
const fetchStatusHistory = async () => {
  try {
    if (!professorUid.value) {
      console.error('No professor UID available')
      return
    }

    const response = await api.get(`/professors/status-history/${professorUid.value}`)
    if (response.data.success) {
      const historyData = response.data.data
      
      // Process the history data
      processHistoryData(historyData)
      
      console.log('🔄 Polled status history:', historyData.length, 'records')
    }
  } catch (error) {
    console.error('❌ Error fetching status history:', error)
  }
}

// Process history data to extract last updates and notifications
const processHistoryData = (historyData) => {
  if (!historyData || historyData.length === 0) return

  // Sort by timestamp descending (newest first)
  const sortedHistory = [...historyData].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  )

  // Set notification history (limit to last 10 items)
  notificationHistory.value = sortedHistory.slice(0, 10)

  // Find last RFID tap
  const lastRfid = sortedHistory.find(item => 
    item.method === 'rfid_tap' || item.type === 'professor_status_toggle'
  )
  if (lastRfid) {
    lastRfidTap.value = `${formatTime(lastRfid.timestamp)} – ${getLocationText(lastRfid)}`
  }

  // Find last manual update
  const lastManual = sortedHistory.find(item => 
    item.method === 'manual' || item.type === 'professor_status_manual'
  )
  if (lastManual) {
    const statusText = getStatusText(lastManual.newStatus)
    lastManualUpdate.value = `${formatTime(lastManual.timestamp)} – ${statusText} (Web)`
  }
}

// Format time for display (e.g., "3:18 PM")
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
}

// Format date for display (e.g., "11/4/2025 – 10:30 PM")
const formatDisplayDate = (timestamp) => {
  const date = new Date(timestamp)
  const formattedDate = date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  })
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
  return `${formattedDate} – ${formattedTime}`
}

// Get location text (you can enhance this based on your data structure)
const getLocationText = (item) => {
  // If you have location data in your logs, extract it here
  // For now, using a default value
  return 'IN KIOSK-ITR-202'
}

// Get status display text
const getStatusText = (status) => {
  switch (status) {
    case 'available': return 'Available ON'
    case 'busy': return 'Busy ON'
    case 'not-available':
    case 'not_available':
      return 'Not Available ON'
    default:
      return 'Status Changed'
  }
}

// Get notification message based on log type
const getNotificationMessage = (notification) => {
  const statusText = getStatusText(notification.newStatus)
  
  if (notification.method === 'rfid_tap' || notification.type === 'professor_status_toggle') {
    return `TAP ${notification.newStatus === 'available' ? 'IN' : 'OUT'} through RFID Tap`
  } else if (notification.method === 'manual' || notification.type === 'professor_status_manual') {
    return `Change Availability Status to ${statusText.replace(' ON', '')}`
  } else {
    return `Status changed to ${statusText.replace(' ON', '')}`
  }
}

// Computed properties for dynamic styling
const currentStatusDisplay = computed(() => {
  switch (currentStatus.value) {
    case 'available': return 'AVAILABLE'
    case 'busy': return 'BUSY'
    case 'not-available':
    case 'not_available':
      return 'NOT AVAILABLE'
    default:
      return 'UNKNOWN'
  }
})

const statusGradientClass = computed(() => {
  switch (currentStatus.value) {
    case 'available':
      return 'bg-gradient-to-b from-emerald-500 to-green-600'
    case 'busy':
      return 'bg-gradient-to-b from-amber-500 to-yellow-600'
    case 'not-available':
    case 'not_available':
      return 'bg-gradient-to-b from-red-500 to-rose-600'
    default:
      return 'bg-gradient-to-b from-gray-500 to-gray-600'
  }
})

// Initial data load with loading state
const initializeData = async () => {
  try {
    isLoading.value = true
    await fetchAllData()
  } finally {
    isLoading.value = false
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