<template>
  <div class="bg-white min-h-screen pb-20 md:pb-8 p-4 md:p-4">
    <!-- Top Bar with Notifications and Profile -->
    <StudentTopNav />

    <div class="px-4 md:px-6 py-4 min-h-0">
      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-6 animate-pulse">
        <!-- Skeleton: Top Section (Chart + Status Cards) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Chart Skeleton -->
          <div class="lg:col-span-2">
            <div class="rounded-xl border border-gray-200 p-8 h-96 bg-gradient-to-b from-slate-200 to-slate-100">
              <div class="flex items-center justify-between mb-6">
                <div class="h-6 w-48 bg-white/40 rounded"></div>
                <div class="flex items-center gap-4">
                  <div class="h-4 w-16 bg-white/30 rounded"></div>
                  <div class="h-4 w-16 bg-white/30 rounded"></div>
                  <div class="h-4 w-16 bg-white/30 rounded"></div>
                </div>
              </div>
              <div class="h-72 flex items-end gap-2">
                <div v-for="n in 10" :key="n" class="flex-1 bg-white/40 rounded-t" :style="{ height: (40 + n * 3) + 'px' }"></div>
              </div>
            </div>
          </div>

          <!-- Status Cards Skeleton -->
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="n in 4"
              :key="n"
              class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center"
            >
              <div class="w-12 h-12 rounded-full bg-gray-100 mr-4"></div>
              <div class="flex-1 space-y-2">
                <div class="h-3 w-20 bg-gray-100 rounded"></div>
                <div class="h-5 w-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Skeleton: Recent Inquiries Table -->
        <section>
          <div class="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div class="h-6 w-40 bg-gray-200 rounded"></div>
            <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div class="h-9 w-full sm:w-72 bg-gray-100 rounded-xl"></div>
              <div class="h-9 w-28 bg-gray-100 rounded-lg"></div>
            </div>
          </div>

          <div class="overflow-x-auto rounded-2xl border border-gray-200">
            <table class="min-w-full border border-gray-100">
              <thead class="bg-gray-100">
                <tr>
                  <th v-for="n in 5" :key="n" class="px-6 py-3">
                    <div class="h-3 w-16 bg-gray-200 rounded"></div>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="row in 4" :key="row" class="bg-white">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-full bg-gray-100"></div>
                      <div class="space-y-2">
                        <div class="h-3 w-24 bg-gray-100 rounded"></div>
                        <div class="h-3 w-32 bg-gray-50 rounded"></div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="h-3 w-28 bg-gray-100 rounded mb-2"></div>
                    <div class="h-3 w-40 bg-gray-50 rounded"></div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="h-3 w-20 bg-gray-100 rounded"></div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="h-6 w-24 bg-gray-100 rounded-full"></div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="h-3 w-24 bg-gray-100 rounded"></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div v-else class="space-y-6">
        <!-- Top Section: Chart + Status Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2">
            <div
              class="rounded-xl border border-gray-200 p-8 h-96"
              style="background: linear-gradient(180deg, #5e89ff, #102a71);"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-semibold text-white">
                  Professor Availability Trend Chart
                </h3>
                <div class="flex items-center gap-4 text-white text-xs">
                  <span class="flex items-center gap-2">
                    <span class="w-3.5 h-3.5 rounded-sm bg-indigo-400"></span>
                    Available
                  </span>
                  <span class="flex items-center gap-2">
                    <span class="w-3.5 h-3.5 rounded-sm bg-indigo-300"></span>
                    Busy
                  </span>
                  <span class="flex items-center gap-2">
                    <span class="w-3.5 h-3.5 rounded-sm bg-indigo-200"></span>
                    Not Available
                  </span>
                </div>
              </div>
              <div class="h-72">
                <ProfessorAvailabilityChart />
              </div>
            </div>
          </div>

          <!-- Status Cards -->
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="(value, key) in statusCards"
              :key="key"
              class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center"
            >
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                :class="value.bg"
              >
                <iconify-icon :icon="value.icon" :class="value.iconClass"></iconify-icon>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">{{ value.label }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats[key] }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Section: Inquiries Table -->
        <section>
          <div class="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 class="text-xl font-semibold text-gray-900">Recent Inquiries</h3>

            <div class="flex flex-col sm:flex-row gap-3">
              <!-- 🔍 Search Input -->
              <div class="relative">
                <iconify-icon
                  icon="fluent:search-16-filled"
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
                />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search..."
                  class="w-full sm:w-72 pl-10 pr-3 py-2 rounded-xl bg-gray-50 text-sm focus:outline-none"
                />
              </div>

              <!-- 🔽 Filter Dropdown -->
              <div class="relative dropdown-container">
                <button
                  @click="openStatus = !openStatus"
                  class="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm min-w-[120px] text-left flex items-center justify-between"
                >
                  <span>{{ statusFilterLabel }}</span>
                  <iconify-icon
                    icon="mdi:chevron-down"
                    class="text-lg transition-transform duration-200"
                    :class="{ 'rotate-180': openStatus }"
                  />
                </button>
                <Transition name="dropdown">
                  <div
                    v-if="openStatus"
                    class="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden"
                  >
                    <button
                      v-for="option in statusOptions"
                      :key="option.value"
                      @click="setStatusFilter(option.value)"
                      class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                      :class="{ 'bg-blue-50 text-blue-600': statusFilter === option.value }"
                    >
                      {{ option.label }}
                    </button>
                  </div>
                </Transition>
              </div>
            </div>
          </div>

          <!-- 🧾 Inquiries Table -->
          <div class="overflow-x-auto rounded-2xl border border-gray-200">
            <table class="min-w-full border border-gray-100">
              <thead class="bg-[#102A71] text-white text-xs uppercase tracking-wide">
                <tr>
                  <th class="px-6 py-4 text-left">Professor</th>
                  <th class="px-6 py-4 text-left">Subject/Message</th>
                  <th class="px-6 py-4 text-left">Date Sent</th>
                  <th class="px-6 py-4 text-left">Status</th>
                  <th class="px-6 py-4 text-left">Response Time</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <!-- 🔹 Inquiry Rows -->
                <tr
                  v-for="inquiry in filteredInquiries"
                  :key="inquiry._id"
                  class="hover:bg-gray-50"
                >
                  <!-- 👨‍🏫 Professor -->
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-9 h-9 rounded-full bg-blue-100 text-blue-600 grid place-items-center ring-2 ring-white shadow"
                      >
                        <span class="text-xs font-bold">
                          {{ inquiry.professor?.initials || getInitials(inquiry.professor?.name) }}
                        </span>
                      </div>
                      <div class="flex flex-col">
                        <span class="font-medium">
                          {{ inquiry.professor?.name || 'Unknown Professor' }}
                        </span>
                        <span class="text-xs text-gray-500">
                          {{ inquiry.professor?.department || 'No department' }}
                        </span>
                      </div>
                    </div>
                  </td>

                  <!-- 📄 Subject / Message -->
                  <td class="px-6 py-4 text-sm text-gray-700">
                    <div class="font-medium">{{ inquiry.subject || '—' }}</div>
                    <p
                      class="line-clamp-2 text-gray-600 mt-1"
                      :title="inquiry.message || ''"
                    >
                      {{ inquiry.message || 'No message provided' }}
                    </p>
                  </td>

                  <!-- 📅 Date -->
                  <td class="px-6 py-4 text-sm">
                    {{ inquiry.dateRelative || new Date(inquiry.createdAt).toLocaleDateString() }}
                  </td>

                  <!-- 📌 Status -->
                 <td class="px-6 py-4 text-sm">
                    <span
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border"
                      :class="getStatusColor(inquiry.status)"
                    >
                      <span
                        class="w-2 h-2 rounded-full"
                        :class="getStatusDot(inquiry.status)"
                      ></span>
                      {{ getStatusDisplayText(inquiry.status) }}
                    </span>
                  </td>

                  <!-- ⏱ Response Time -->
                  <td class="px-6 py-4 text-sm">
                    {{ formattedDate(inquiry.updatedAt) || '—' }}
                  </td>
                </tr>

                <!-- ⚠️ No Inquiries -->
                <tr v-if="filteredInquiries.length === 0">
                  <td colspan="5" class="text-center py-10 text-gray-500">
                    <iconify-icon
                      icon="mdi:email-off-outline"
                      class="text-xl text-gray-300 mb-2"
                    />
                    <p>No inquiries found</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import StudentTopNav from '@/components/StudentTopNav.vue'
import ProfessorAvailabilityChart from '@/components/ProfessorAvailabilityChart.vue'
import api from '@/utils/api'

// ==============================
// 🔹 State
// ==============================
const searchQuery = ref('')
const statusFilter = ref('all')
const openStatus = ref(false)

const stats = ref({
  available: 0,
  busy: 0,
  notAvailable: 0,
  inquiriesSentCount: 0
})

const inquiries = ref([])
const user = ref({ firstName: '', lastName: '', role: '', emailAddress: '' })
const studentId = localStorage.getItem('id')
const isLoading = ref(true)
const pollInterval = ref(null) // Added for polling

// ==============================
// 🔹 Dropdown and Filter Config
// ==============================
const statusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Replied', value: 'replied' },
  { label: 'Unread', value: 'unread' },
  { label: 'Resolved', value: 'resolved' }
]

const statusCards = {
  available: {
    label: 'Available',
    icon: 'stash:person',
    iconClass: 'text-3xl text-green-500',
    bg: 'bg-green-50'
  },
  busy: {
    label: 'Busy',
    icon: 'stash:person',
    iconClass: 'text-3xl text-yellow-500',
    bg: 'bg-yellow-50'
  },
  notAvailable: {
    label: 'Not Available',
    icon: 'stash:person',
    iconClass: 'text-3xl text-gray-500',
    bg: 'bg-gray-50'
  },
  inquiriesSentCount: {
    label: 'Inquiries Sent',
    icon: 'mingcute:message-4-line',
    iconClass: 'text-3xl text-blue-500',
    bg: 'bg-blue-50'
  }
}

const statusFilterLabel = computed(() =>
  statusFilter.value === 'all'
    ? 'All'
    : statusFilter.value.charAt(0).toUpperCase() + statusFilter.value.slice(1)
)

const setStatusFilter = (val) => {
  statusFilter.value = val
  openStatus.value = false
}

// ==============================
// 🔹 Utility Functions
// ==============================
const getInitials = (name) => {
  if (!name) return ''
  const parts = name.trim().split(' ')
  return `${parts[0]?.[0] || ''}${parts[1]?.[0] || ''}`.toUpperCase()
}

const getStatusColor = (status) => {
  const statusLower = status?.toLowerCase() || 'pending';
  
  const colorMap = {
    'accepted': 'bg-green-50 text-green-700 border-green-200',
    'replied': 'bg-green-50 text-green-700 border-green-200',
    'resolved': 'bg-green-50 text-green-700 border-green-200',
    'declined': 'bg-red-50 text-red-700 border-red-200',
    'pending': 'bg-amber-50 text-amber-700 border-amber-200',
    'unread': 'bg-blue-50 text-blue-700 border-blue-200',
    'closed': 'bg-gray-50 text-gray-700 border-gray-200',
    'in-progress': 'bg-blue-50 text-blue-700 border-blue-200'
  };
  
  return colorMap[statusLower] || 'bg-gray-50 text-gray-700 border-gray-200';
}

const getStatusDot = (status) => {
  const statusLower = status?.toLowerCase() || 'pending';
  
  const dotMap = {
    'accepted': 'bg-green-500',
    'replied': 'bg-green-500',
    'resolved': 'bg-green-500',
    'declined': 'bg-red-500',
    'pending': 'bg-amber-500',
    'unread': 'bg-blue-500',
    'in-progress': 'bg-blue-500'
  };
  
  return dotMap[statusLower] || 'bg-gray-500';
}

const getStatusDisplayText = (status) => {
  const statusLower = status?.toLowerCase() || 'pending';
  
  const textMap = {
    'accepted': 'Accepted',
    'replied': 'Replied',
    'resolved': 'Resolved', 
    'declined': 'Declined',
    'pending': 'Pending',
    'unread': 'Unread',
    'in-progress': 'In Progress',
    'closed': 'Closed'
  };
  
  return textMap[statusLower] || 'Pending';
}

// ==============================
// 🔹 Computed: Filter Inquiries
// ==============================
const filteredInquiries = computed(() => {
  let filtered = inquiries.value
  const query = searchQuery.value.toLowerCase()

  if (query) {
    filtered = filtered.filter((i) =>
      [i.professor?.name, i.subject, i.message]
        .filter(Boolean)
        .some((f) => f.toLowerCase().includes(query))
    )
  }

  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(
      (i) => i.status?.toLowerCase() === statusFilter.value.toLowerCase()
    )
  }

  return filtered
})

const formattedDate = (dateString) => {
  if (!dateString) return null
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

// ==============================
// 🔹 Fetch Dashboard Data
// ==============================
const fetchDashboardData = async () => {
  try {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      console.error('❌ No user found in localStorage')
      return
    }

    user.value = JSON.parse(storedUser)
    const studentId = user.value._id || user.value.id

    if (!studentId) {
      console.error('❌ Missing studentId in stored user')
      return
    }

    const { data } = await api.get(`/dashboard/student?studentId=${studentId}`)
    console.log('📊 Dashboard API Response:', data) // Add this for debugging

    if (data.success) {
      const d = data.data
      
      // Debug log to see what's coming from backend
      console.log('📈 Stats from backend:', d.stats)
      console.log('📋 Recent inquiries:', d.recentInquiries)
      
      stats.value = {
        available: d.stats?.available || 0,
        busy: d.stats?.busy || 0,
        notAvailable: d.stats?.notAvailable || 0,
        inquiriesSentCount: d.inquiriesSentCount || 0
      }
      inquiries.value = d.recentInquiries || []
      
      console.log('🎯 Final stats:', stats.value)
    } else {
      console.warn('⚠️ Failed to fetch dashboard data:', data.message)
    }
  } catch (err) {
    console.error('❌ Error fetching dashboard:', err)
    console.error('📋 Error details:', err.response?.data)
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
  pollInterval.value = setInterval(fetchDashboardData, 2000)
  console.log('🔄 Started polling dashboard data every 2 seconds')
}

const stopPolling = () => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
    pollInterval.value = null
    console.log('🛑 Stopped polling dashboard data')
  }
}

// Initial data load with loading state
const initializeData = async () => {
  try {
    isLoading.value = true
    await fetchDashboardData()
  } finally {
    isLoading.value = false
  }
}

// ==============================
// 🔹 Lifecycle Hooks
// ==============================
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-container')) openStatus.value = false
  })
  
  // Initialize data and start polling
  initializeData().then(() => {
    // Start polling after initial load is complete
    startPolling()
  })
})

onUnmounted(() => {
  document.removeEventListener('click', () => {})
  // Clean up interval when component is destroyed
  stopPolling()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}
.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>