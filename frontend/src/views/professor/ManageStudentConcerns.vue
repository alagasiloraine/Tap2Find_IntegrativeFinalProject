<template>
  <div class="bg-white min-h-screen pb-20 md:pb-8 p-4 md:p-4">
    <ProfessorTopNav />
    <div class="px-4 md:px-6 py-4 min-h-0">
      <div class="space-y-6">
        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="rounded-2xl shadow p-5 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 grid place-items-center">
              <iconify-icon icon="material-symbols:mail-outline" class="text-2xl" />
            </div>
            <div>
              <div class="text-gray-600">Total Concerns</div>
              <div class="text-3xl font-bold">{{ totalConcerns }}</div>
            </div>
          </div>
          <div class="rounded-2xl shadow p-5 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 grid place-items-center">
              <iconify-icon icon="tabler:mail-up" class="text-2xl" />
            </div>
            <div>
              <div class="text-gray-600">Pending</div>
              <div class="text-3xl font-bold">{{ pendingCount }}</div>
            </div>
          </div>
          <div class="rounded-2xl shadow p-5 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-green-100 text-green-600 grid place-items-center">
              <iconify-icon icon="mdi:email-check-outline" class="text-2xl" />
            </div>
            <div>
              <div class="text-gray-600">Resolved</div>
              <div class="text-3xl font-bold">{{ resolvedCount }}</div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex-1 min-w-[200px] max-w-md">
            <div class="relative">
              <iconify-icon icon="fluent:search-16-filled" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search ..."
                class="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 text-sm focus:outline-none  focus:border-transparent"
              />
            </div>
          </div>
          <div class="flex flex-wrap gap-3">
            <!-- Status Dropdown -->
            <div class="relative dropdown-container">
              <button
                @click="openDropdowns.status = !openDropdowns.status"
                class="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm min-w-[140px] text-left flex items-center justify-between"
              >
                <span>{{ filters.status || 'All Status' }}</span>
                <iconify-icon 
                  icon="mdi:chevron-down" 
                  class="text-lg transition-transform duration-200"
                  :class="{ 'rotate-180': openDropdowns.status }"
                />
              </button>
              <Transition name="dropdown">
                <div v-if="openDropdowns.status" class="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                  <button
                    @click="filters.status = ''; openDropdowns.status = false"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    :class="{ 'bg-blue-50 text-blue-600': filters.status === '' }"
                  >
                    All Status
                  </button>
                  <button
                    @click="filters.status = 'pending'; openDropdowns.status = false"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    :class="{ 'bg-blue-50 text-blue-600': filters.status === 'pending' }"
                  >
                    Pending
                  </button>
                  <button
                    @click="filters.status = 'resolved'; openDropdowns.status = false"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    :class="{ 'bg-blue-50 text-blue-600': filters.status === 'resolved' }"
                  >
                    Resolved
                  </button>
                  <button
                    @click="filters.status = 'in-progress'; openDropdowns.status = false"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    :class="{ 'bg-blue-50 text-blue-600': filters.status === 'in-progress' }"
                  >
                    In Progress
                  </button>
                </div>
              </Transition>
            </div>

            <!-- Date Dropdown -->
            <div class="relative dropdown-container">
              <button
                @click="openDropdowns.date = !openDropdowns.date"
                class="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm min-w-[140px] text-left flex items-center justify-between"
              >
                <span>{{ getDateFilterText() }}</span>
                <iconify-icon 
                  icon="mdi:chevron-down" 
                  class="text-lg transition-transform duration-200"
                  :class="{ 'rotate-180': openDropdowns.date }"
                />
              </button>
              <Transition name="dropdown">
                <div v-if="openDropdowns.date" class="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                  <button
                    @click="filters.date = 'all'; openDropdowns.date = false"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    :class="{ 'bg-blue-50 text-blue-600': filters.date === 'all' }"
                  >
                    All Dates
                  </button>
                  <button
                    @click="filters.date = 'today'; openDropdowns.date = false"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    :class="{ 'bg-blue-50 text-blue-600': filters.date === 'today' }"
                  >
                    Today
                  </button>
                  <button
                    @click="filters.date = 'week'; openDropdowns.date = false"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    :class="{ 'bg-blue-50 text-blue-600': filters.date === 'week' }"
                  >
                    This Week
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- Concerns Table -->
        <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full align-middle">
              <thead class="bg-[#102A71] text-white text-xs uppercase tracking-wide">
                <tr>
                  <th class="text-left px-6 py-4 font-semibold">Student</th>
                  <th class="text-left px-6 py-4 font-semibold">Year Level</th>
                  <th class="text-left px-6 py-4 font-semibold">Message</th>
                  <th class="text-left px-6 py-4 font-semibold">Submitted</th>
                  <th class="text-left px-6 py-4 font-semibold">Status</th>
                  <th class="text-left px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="item in filteredConcerns" :key="item.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm text-gray-900">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-full bg-orange-200 text-orange-700 grid place-items-center font-bold">
                        {{ item.initials }}
                      </div>
                      <div class="flex flex-col">
                        <span class="font-medium">{{ item.name }}</span>
                        <span class="text-xs text-gray-500">{{ item.email }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-700">
                    <span class="inline-flex items-center gap-1 px-2 py-1 text-gray-700">
                      {{ item.yearLevel || 'Not specified' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-700">
                    <div class="max-w-[420px]">
                      <p class="line-clamp-2">{{ item.subject }}</p>
                      <p class="text-xs text-gray-500 mt-1 line-clamp-1">{{ item.message }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{{ formatDate(item.createdAt) }}</td>
                  <td class="px-6 py-4 text-sm">
                    <span
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border"
                      :class="getStatusClass(item.status)"
                    >
                      <span class="w-2 h-2 rounded-full" :class="getStatusDotClass(item.status)"></span>
                      {{ getStatusText(item.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <div class="flex items-center gap-2">
                      <button @click="viewConcern(item)" class="group inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors">
                        <iconify-icon icon="lets-icons:view" class="text-base group-hover:text-gray-800" />
                        <span class="hidden sm:inline text-xs">View</span>
                      </button>
                      <button
                        @click="resolveConcern(item)"
                        class="group inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-colors"
                        :class="item.status === 'pending' ? 'border-amber-300 text-amber-700 hover:bg-amber-50' : 'border-green-300 text-green-700 hover:bg-green-50'"
                      >
                        <iconify-icon :icon="item.status === 'pending' ? 'tabler:mail-up' : 'mdi:email-check-outline'" class="text-base" />
                        <span class="hidden sm:inline text-xs">{{ item.status === 'pending' ? 'Resolve' : 'Resolved' }}</span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredConcerns.length === 0 && !loading">
                  <td colspan="6" class="px-6 py-10 text-center text-sm text-gray-500">
                    <div class="flex flex-col items-center gap-2">
                      <iconify-icon icon="mdi:email-off-outline" class="text-3xl text-gray-300" />
                      <span>No concerns found</span>
                    </div>
                  </td>
                </tr>
                <tr v-if="loading">
                  <td colspan="6" class="px-6 py-10 text-center text-sm text-gray-500">
                    <div class="flex flex-col items-center gap-2">
                      <iconify-icon icon="eos-icons:loading" class="text-3xl text-gray-300 animate-spin" />
                      <span>Loading concerns...</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <!-- View Concern Modal -->
    <Transition name="modal">
      <div v-if="isViewModalOpen" class="fixed inset-0 z-[100] grid place-items-center">
        <div class="absolute inset-0 bg-black/40" @click="closeViewModal"></div>
        <div class="relative w-[90%] max-w-md rounded-2xl shadow-xl overflow-hidden bg-white">
          <!-- Header -->
          <div class="flex items-center gap-3 bg-gray-100 px-4 py-3">
            <div class="w-10 h-10 rounded-full bg-orange-200 text-orange-700 grid place-items-center font-bold">
              {{ selectedConcern?.initials }}
            </div>
            <div class="flex-1">
              <div class="font-semibold text-gray-900">{{ selectedConcern?.name }}</div>
              <div class="text-xs text-gray-600">{{ selectedConcern?.email }}</div>
              <div class="text-xs text-gray-500">{{ formatDate(selectedConcern?.createdAt || new Date().toISOString()) }}</div>
            </div>
          </div>

          <!-- Body -->
          <div class="p-5">
            <div class="mb-4">
              <div class="text-sm font-medium text-gray-700 mb-1">Subject:</div>
              <div class="text-sm text-gray-900">{{ selectedConcern?.subject }}</div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-700 mb-1">Message:</div>
              <div class="text-sm text-gray-700 whitespace-pre-line bg-gray-50 p-3 rounded-lg">{{ selectedConcern?.message }}</div>
            </div>

            <div class="mt-6 grid grid-cols-2 gap-3">
              <button
                @click="declineSelected()"
                class="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
              >
                Mark as Pending
              </button>
              <button
                @click="acceptSelected()"
                class="px-4 py-2 rounded-xl bg-[#102A71] text-white font-medium hover:bg-[#102A71]/90 transition-colors"
              >
                Mark as Resolved
              </button>
            </div>
          </div>

          <!-- Close -->
          <button @click="closeViewModal" class="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
            <iconify-icon icon="mdi:close" class="text-2xl" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import ProfessorTopNav from '@/components/ProfessorTopNav.vue'
import api from '@/utils/api'

const user = ref({
  _id: '',
  firstName: '',
  lastName: '',
  role: '',
  emailAddress: '',
  status: ''
})

const concerns = ref([])
const loading = ref(false)
const filters = ref({ status: '', date: 'all' })
const searchQuery = ref('')
const openDropdowns = ref({
  status: false,
  date: false
})

// Modal state
const isViewModalOpen = ref(false)
const selectedConcern = ref(null)

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.dropdown-container')) {
    openDropdowns.value = {
      status: false,
      date: false
    }
  }
}

// Fetch all concerns for the professor
const fetchAllConcerns = async () => {
  try {
    loading.value = true
    const professorId = user.value.id
    if (!professorId) {
      console.error('No professorId found')
      return
    }

    console.log('Fetching concerns for professor:', professorId)
    
    const response = await api.get('/professors/concerns', {
      params: { 
        professorId,
        page: 1,
        limit: 100
      }
    })
    
    console.log('API Response:', response.data)
    
    if (response.data.success) {
      // Map the backend data to frontend expected format
      concerns.value = (response.data.data.inquiries || []).map(inquiry => ({
        id: inquiry.id || inquiry._id,
        name: inquiry.name,
        email: inquiry.email,
        initials: inquiry.initials,
        subject: inquiry.subject,
        message: inquiry.message,
        status: inquiry.status || 'pending',
        createdAt: inquiry.createdAt,
        updatedAt: inquiry.updatedAt,
        yearLevel: inquiry.yearLevel || 'Not specified', // Add default if missing
        studentId: inquiry.studentId
      }))
      console.log('Mapped concerns:', concerns.value)
    } else {
      console.error('API returned success: false', response.data)
    }
  } catch (error) {
    console.error('Error fetching concerns:', error)
    console.error('Error details:', error.response?.data)
  } finally {
    loading.value = false
  }
}

// Update concern status
const updateConcernStatus = async (concernId, status) => {
  try {
    const professorId = user.value.id
    console.log('Updating concern:', concernId, 'to status:', status)
    
    const response = await api.patch(`/professors/concerns/${concernId}`, { 
      status,
      professorId 
    })
    
    console.log('Update response:', response.data)
    
    if (response.data.success) {
      // Update local state
      const concernIndex = concerns.value.findIndex(c => c.id === concernId)
      if (concernIndex !== -1) {
        concerns.value[concernIndex].status = status
        concerns.value[concernIndex].updatedAt = new Date().toISOString()
      }
      return true
    }
  } catch (error) {
    console.error('Error updating concern status:', error)
    console.error('Error details:', error.response?.data)
    throw error
  }
}

// Statistics
const totalConcerns = computed(() => concerns.value.length)
const pendingCount = computed(() => concerns.value.filter(c => c.status === 'pending').length)
const resolvedCount = computed(() => concerns.value.filter(c => c.status === 'resolved').length)

// Filtered concerns
const filteredConcerns = computed(() => {
  return concerns.value.filter(c => {
    const statusOk = !filters.value.status || c.status === filters.value.status
    let dateOk = true
    
    if (filters.value.date !== 'all') {
      const d = new Date(c.createdAt)
      const now = new Date()
      
      if (filters.value.date === 'today') {
        dateOk = d.toDateString() === now.toDateString()
      } else if (filters.value.date === 'week') {
        const first = new Date(now)
        const day = now.getDay() || 7
        first.setDate(now.getDate() - day + 1)
        first.setHours(0,0,0,0)
        const last = new Date(first)
        last.setDate(first.getDate() + 6)
        last.setHours(23,59,59,999)
        dateOk = d >= first && d <= last
      }
    }
    
    const searchOk = !searchQuery.value || 
      c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.message.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (c.yearLevel && c.yearLevel.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    return statusOk && dateOk && searchOk
  })
})

// Helper functions
const getDateFilterText = () => {
  switch (filters.value.date) {
    case 'today': return 'Today'
    case 'week': return 'This Week'
    default: return 'All Dates'
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'resolved':
      return 'bg-green-50 text-green-700 border-green-200'
    case 'in-progress':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    default:
      return 'bg-amber-50 text-amber-700 border-amber-200'
  }
}

const getStatusDotClass = (status) => {
  switch (status) {
    case 'resolved':
      return 'bg-green-500'
    case 'in-progress':
      return 'bg-blue-500'
    default:
      return 'bg-amber-500'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'resolved':
      return 'Resolved'
    case 'in-progress':
      return 'In Progress'
    default:
      return 'Pending'
  }
}

const formatDate = (iso) => {
  if (!iso) return 'Unknown date'
  const d = new Date(iso)
  const opts = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }
  return d.toLocaleString(undefined, opts)
}

// Modal functions
function openViewModal(item) {
  selectedConcern.value = { ...item }
  isViewModalOpen.value = true
}

function closeViewModal() {
  isViewModalOpen.value = false
}

function viewConcern(item) { 
  openViewModal(item) 
}

async function resolveConcern(item) {
  try {
    const newStatus = item.status === 'pending' ? 'resolved' : 'pending'
    await updateConcernStatus(item.id, newStatus)
  } catch (error) {
    console.error('Failed to update concern status:', error)
    alert('Failed to update concern status. Please try again.')
  }
}

async function acceptSelected() {
  if (!selectedConcern.value) return
  try {
    await updateConcernStatus(selectedConcern.value.id, 'resolved')
    closeViewModal()
  } catch (error) {
    console.error('Failed to resolve concern:', error)
    alert('Failed to resolve concern. Please try again.')
  }
}

async function declineSelected() {
  if (!selectedConcern.value) return
  try {
    await updateConcernStatus(selectedConcern.value.id, 'pending')
    closeViewModal()
  } catch (error) {
    console.error('Failed to update concern status:', error)
    alert('Failed to update concern status. Please try again.')
  }
}

// Debug function to check localStorage
const checkUserData = () => {
  const storedUser = localStorage.getItem('user')
  console.log('Stored user data:', storedUser)
  if (storedUser) {
    const parsed = JSON.parse(storedUser)
    console.log('Parsed user data:', parsed)
    console.log('Professor ID:', parsed._id)
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // Debug: Check what's in localStorage
  checkUserData()
  
  // Load user from localStorage
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
    console.log('User loaded:', user.value)
    fetchAllConcerns()
  } else {
    console.error('No user found in localStorage')
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Dropdown Fade + Slide Down Transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Modal fade */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>