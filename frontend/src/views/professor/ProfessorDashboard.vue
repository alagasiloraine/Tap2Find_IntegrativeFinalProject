<template>
  <div class="bg-white min-h-screen pb-20 md:pb-8 p-4 md:p-4">
    <ProfessorTopNav />
    <div class="px-4 md:px-6 py-4 min-h-0">
      <div class="space-y-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-xl bg-gray-50  p-5 ">
           <div class="flex items-center gap-3">
    <div class="flex items-center gap-2">
      <div class="w-3 h-3 rounded-full" :class="statusDotClass"></div>
      <span class="text-sm font-medium" :class="statusTextClass">
        {{ statusDisplayText }}
      </span>
    </div>
  </div>
          <!-- Removed change status dropdown -->
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="rounded-xl shadow p-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 grid place-items-center">
                <Icon icon="material-symbols:today" class="w-5 h-5" />
              </div>
              <div>
                <div class="text-gray-600">Today's Concern</div>
                <div class="text-2xl font-bold">{{ statistics.today }}</div>
                <div class="text-xs text-gray-400" v-if="statistics.today > 0">
                  {{ getTodayComparisonText() }}
                </div>
              </div>
            </div>
          </div>
          <div class="rounded-xl shadow p-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 grid place-items-center">
                <Icon icon="formkit:week" class="w-5 h-5" />
              </div>
              <div>
                <div class="text-gray-600">This Week's Concern</div>
                <div class="text-2xl font-bold">{{ statistics.thisWeek }}</div>
                <div class="text-xs text-gray-400" v-if="statistics.thisWeek > 0">
                  {{ getWeekPendingText() }}
                </div>
              </div>
            </div>
          </div>
          <div class="rounded-xl shadow p-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-green-100 text-green-600 grid place-items-center">
                <Icon icon="pajamas:task-done" class="w-5 h-5" />
              </div>
              <div>
                <div class="text-gray-600">Resolved</div>
                <div class="text-2xl font-bold">{{ statistics.resolved }}</div>
                <div class="text-xs text-gray-400" v-if="statistics.thisWeek > 0">
                  {{ getResolutionRate() }}% resolution rate
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Student Concerns -->
        <div class="rounded-2xl shadow">
          <div class="px-5 pt-5">
            <div class="text-xl font-semibold">Recent Student Concerns</div>
            <div class="text-sm text-gray-500">
              <span v-if="loading">Loading concerns...</span>
              <span v-else>You have {{ recentConcerns.length }} recent concerns</span>
            </div>
          </div>
          <div class="mt-3">
            <div
              v-for="(item, idx) in recentConcerns"
              :key="item.id"
              class="relative flex items-center justify-between gap-3 px-5 py-3 border-t border-gray-200">
              <div class="flex items-start gap-3 flex-1">
                <div class="w-9 h-9 rounded-full bg-orange-200 text-orange-700 grid place-items-center font-bold">
                  {{ item.initials }}
                </div>
                <div class="flex-1">
                  <div class="font-semibold">{{ item.name }}</div>
                  <div class="text-sm text-gray-500">{{ item.subject }}</div>
                  <div class="text-xs text-gray-400 mt-1">{{ formatDate(item.createdAt) }}</div>
                </div>
                <div :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusClass(item.status)]">
                  {{ getStatusText(item.status) }}
                </div>
              </div>
            </div>
            <div v-if="recentConcerns.length === 0 && !loading" class="px-5 py-8 text-center text-gray-500">
              No recent concerns found
            </div>
            <div v-if="loading" class="px-5 py-8 text-center text-gray-500">
              Loading concerns...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import ProfessorTopNav from '@/components/ProfessorTopNav.vue'
import api from '@/utils/api'

const openMenuId = ref(null)
const concerns = ref([])
const recentConcerns = ref([])
const loading = ref(false)

const user = ref({
  id: '',
  firstName: '',
  lastName: '',
  role: '',
  emailAddress: '',
  status: ''
})

const statistics = ref({
  today: 0,
  thisWeek: 0,
  resolved: 0
})

// Status computed properties
const statusTextClass = computed(() => {
  const currentStatus = user.value.status
  if (currentStatus === 'available') return 'text-green-700'
  if (currentStatus === 'busy') return 'text-orange-700'
  return 'text-red-700'
})

const statusDotClass = computed(() => {
  const currentStatus = user.value.status
  if (currentStatus === 'available') return 'bg-green-500'
  if (currentStatus === 'busy') return 'bg-orange-500'
  return 'bg-red-500'
})

const statusDisplayText = computed(() => {
  const currentStatus = user.value.status
  if (currentStatus === 'available') return 'Available'
  if (currentStatus === 'busy') return 'Busy'
  if (currentStatus === 'not-available') return 'Not Available'
  return 'Unknown'
})

// Fetch current user status from backend
const fetchCurrentUserStatus = async () => {
  try {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      console.error('No user found in localStorage')
      return
    }

    const parsedUser = JSON.parse(storedUser)
    const response = await api.get(`/professors/${parsedUser.id}/status`)
    
    if (response.data.success) {
      // Update the user status with real-time data
      user.value.status = response.data.data.status
      
      // Also update localStorage with the latest status
      const updatedUser = { ...parsedUser, status: response.data.data.status }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      console.log('✅ Updated user status:', response.data.data.status)
    }
  } catch (error) {
    console.error('Error fetching user status:', error)
  }
}

// Fetch statistics for the professor
const fetchStatistics = async () => {
  try {
    loading.value = true
    const professorId = user.value.id
    if (!professorId) {
      console.error('No professorId found for statistics')
      return
    }

    console.log('Fetching statistics for professor:', professorId)
    
    const response = await api.get('/professors/statistics', {
      params: { professorId }
    })
    
    console.log('Statistics response:', response.data)
    
    if (response.data.success) {
      statistics.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching statistics:', error)
    console.error('Error details:', error.response?.data)
  } finally {
    loading.value = false
  }
}

// Fetch recent concerns/inquiries
const fetchRecentConcerns = async () => {
  try {
    const professorId = user.value.id
    if (!professorId) {
      console.error('No professorId found for recent concerns')
      return
    }

    console.log('Fetching recent concerns for professor:', professorId)
    
    const response = await api.get('/professors/concerns/recent', {
      params: { professorId }
    })
    
    console.log('Recent concerns response:', response.data)
    
    if (response.data.success) {
      recentConcerns.value = response.data.data.map(concern => ({
        id: concern.id || concern._id,
        name: concern.name,
        subject: concern.subject,
        message: concern.message,
        initials: concern.initials,
        email: concern.email,
        status: concern.status || 'pending',
        createdAt: concern.createdAt
      }))
      console.log('Mapped recent concerns:', recentConcerns.value)
    }
  } catch (error) {
    console.error('Error fetching recent concerns:', error)
    console.error('Error details:', error.response?.data)
  }
}

// Real-time status polling
let statusPollingInterval = null
const startStatusPolling = () => {
  // Poll every 5 seconds for status updates
  statusPollingInterval = setInterval(() => {
    fetchCurrentUserStatus()
  }, 5000)
}

// Helper functions for display text
const getTodayComparisonText = () => {
  if (statistics.value.today === 0) return 'No concerns today'
  return `${statistics.value.today} concern${statistics.value.today !== 1 ? 's' : ''} today`
}

const getWeekPendingText = () => {
  const pending = statistics.value.thisWeek - statistics.value.resolved
  if (pending > 0) {
    return `${pending} pending`
  }
  return 'All caught up!'
}

const getResolutionRate = () => {
  if (statistics.value.thisWeek === 0) return 0
  return Math.round((statistics.value.resolved / statistics.value.thisWeek) * 100)
}

const getStatusClass = (status) => {
  switch (status) {
    case 'resolved':
      return 'bg-green-100 text-green-800'
    case 'replied':
      return 'bg-blue-100 text-blue-800'
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'resolved':
      return 'Resolved'
    case 'replied':
      return 'Replied'
    case 'in-progress':
      return 'In Progress'
    default:
      return 'Pending'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown date'
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return date.toLocaleDateString()
  }
}

function toggleMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id
}

function onReply(item) {
  openMenuId.value = null
}

function onDelete(item) {
  openMenuId.value = null
}

onMounted(async () => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
    console.log('Dashboard - User loaded:', user.value)
    
    // Fetch initial status from backend
    await fetchCurrentUserStatus()
    
    // Fetch data after user is loaded
    await fetchStatistics()
    await fetchRecentConcerns()
    
    // Start real-time status polling
    startStatusPolling()
  } else {
    console.error('Dashboard - No user found in localStorage')
  }
})

// Clean up polling when component unmounts
onUnmounted(() => {
  if (statusPollingInterval) {
    clearInterval(statusPollingInterval)
  }
})
</script>