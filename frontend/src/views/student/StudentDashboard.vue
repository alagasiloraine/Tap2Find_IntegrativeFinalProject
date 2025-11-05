<template>
  <div class="bg-white min-h-screen pb-20 md:pb-8 p-4 md:p-4">
    <!-- Top Bar with Notifications and Profile -->
    <StudentTopNav />

    <!-- Content Division -->
    <div class="px-4 md:px-6 py-4 min-h-0">
      <!-- Dashboard Layout -->
      <div class="space-y-6">
        <!-- Top Section: Chart and Status Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Professor Availability Trend Chart (Large Area) -->
          <div class="lg:col-span-2">
            <div class="rounded-xl border border-gray-200 p-8 h-96" style="background: linear-gradient(180deg, #5e89ff, #102a71);">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-semibold text-white">Professor Availability Trend Chart</h3>
                <div class="flex items-center gap-4 text-white">
                  <span class="flex items-center gap-2 text-xs">
                    <span class="w-3.5 h-3.5 rounded-sm bg-indigo-400"></span>
                    <span>Available</span>
                  </span>
                  <span class="flex items-center gap-2 text-xs">
                    <span class="w-3.5 h-3.5 rounded-sm bg-indigo-300"></span>
                    <span>Busy</span>
                  </span>
                  <span class="flex items-center gap-2 text-xs">
                    <span class="w-3.5 h-3.5 rounded-sm bg-indigo-200"></span>
                    <span>Not Available</span>
                  </span>
                </div>
              </div>
              <div class="h-72">
                <ProfessorAvailabilityChart />
              </div>
            </div>
          </div>

          <!-- Status Cards Grid (2x2) -->
          <div class="grid grid-cols-2 gap-4">
            <!-- Available Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5  transition-shadow duration-200 h-full flex items-center">
              <div class="flex items-center w-full">
                <div class="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <iconify-icon icon="stash:person" class="text-3xl text-green-500"></iconify-icon>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">Available</p>
                  <p class="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </div>

            <!-- Busy Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5  transition-shadow duration-200 h-full flex items-center">
              <div class="flex items-center w-full">
                <div class="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <iconify-icon icon="stash:person" class="text-3xl text-yellow-500"></iconify-icon>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">Busy</p>
                  <p class="text-2xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </div>

            <!-- Not Available Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5  transition-shadow duration-200 h-full flex items-center">
              <div class="flex items-center w-full">
                <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <iconify-icon icon="stash:person" class="text-3xl text-gray-500"></iconify-icon>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">Not Available</p>
                  <p class="text-2xl font-bold text-gray-900">5</p>
                </div>
              </div>
            </div>

            <!-- Inquiries Sent Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5  transition-shadow duration-200 h-full flex items-center">
              <div class="flex items-center w-full">
                <div class="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <iconify-icon icon="mingcute:message-4-line" class="text-3xl text-blue-500"></iconify-icon>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">Inquiries Sent</p>
                  <p class="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Section: Recent Inquiries Table -->
        <section>
          <div class="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 class="text-xl font-semibold text-gray-900">Recent Inquiries</h3>
            <div class="flex flex-col sm:flex-row gap-3">
              <!-- Search -->
              <div class="relative">
                <iconify-icon icon="fluent:search-16-filled" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search..."
                  class="w-full sm:w-72 pl-10 pr-3 py-2 rounded-xl bg-gray-50 text-sm focus:outline-none"
                />
              </div>
              <!-- Status Filter Dropdown -->
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
                  <div v-if="openStatus" class="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                    <button @click="setStatusFilter('all')" class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50" :class="{ 'bg-blue-50 text-[#102A71]': statusFilter === 'all' }">All Status</button>
                    <button @click="setStatusFilter('pending')" class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50" :class="{ 'bg-blue-50 text-blue-600': statusFilter === 'pending' }">Pending</button>
                    <button @click="setStatusFilter('replied')" class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50" :class="{ 'bg-blue-50 text-blue-600': statusFilter === 'replied' }">Replied</button>
                    <button @click="setStatusFilter('unread')" class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50" :class="{ 'bg-blue-50 text-blue-600': statusFilter === 'unread' }">Unread</button>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
          <div class="overflow-x-auto rounded-2xl border border-gray-200">
            <table class="min-w-full align-middle border border-gray-100 ">
              <thead class="bg-[#102A71] text-white text-xs uppercase tracking-wide">
                <tr>
                  <th class="text-left px-6 py-4 font-semibold">Professor</th>
                  <th class="text-left px-6 py-4 font-semibold">Subject/Message</th>
                  <th class="text-left px-6 py-4 font-semibold">Date Sent</th>
                  <th class="text-left px-6 py-4 font-semibold">Status</th>
                  <th class="text-left px-6 py-4 font-semibold">Response Time</th>
                                  </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="inquiry in filteredInquiries" :key="inquiry.id" class="hover:bg-gray-50">
                  <!-- Professor Column -->
                  <td class="px-6 py-4 text-sm text-gray-900">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-full bg-blue-100 text-blue-600 grid place-items-center ring-2 ring-white shadow">
                        <span class="text-xs font-bold">{{ inquiry.professor.initials }}</span>
                      </div>
                      <div class="flex flex-col">
                        <span class="font-medium">{{ inquiry.professor.name }}</span>
                        <span class="text-xs text-gray-500">{{ inquiry.professor.department }}</span>
                      </div>
                    </div>
                  </td>
                  <!-- Subject/Message Column -->
                  <td class="px-6 py-4 text-sm text-gray-700">
                    <div class="max-w-[420px]">
                      <div class="font-medium text-gray-900">{{ inquiry.subject }}</div>
                      <p class="line-clamp-2 text-gray-600 mt-1" :title="inquiry.message">{{ inquiry.message }}</p>
                    </div>
                  </td>
                  <!-- Date Sent Column -->
                  <td class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    <span :title="inquiry.dateExact">{{ inquiry.dateRelative }}</span>
                  </td>
                  <!-- Status Column -->
                  <td class="px-6 py-4 text-sm">
                    <span
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border"
                      :class="{
                        'bg-green-50 text-green-700 border-green-200': inquiry.status === 'Replied',
                        'bg-amber-50 text-amber-700 border-amber-200': inquiry.status === 'Pending',
                        'bg-blue-50 text-blue-700 border-blue-200': inquiry.status === 'Unread',
                        'bg-gray-50 text-gray-700 border-gray-200': inquiry.status === 'Closed'
                      }"
                    >
                      <span class="w-2 h-2 rounded-full"
                        :class="{
                          'bg-green-500': inquiry.status === 'Replied',
                          'bg-amber-500': inquiry.status === 'Pending',
                          'bg-blue-500': inquiry.status === 'Unread',
                        }">
                      </span>
                      {{ inquiry.status }}
                    </span>
                  </td>
                  <!-- Response Column -->
                  <td class="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {{ inquiry.responseTime || '—' }}
                  </td>
                                  </tr>
                <tr v-if="filteredInquiries.length === 0">
                  <td colspan="5" class="px-6 py-10 text-center text-sm text-gray-500">
                    <div class="flex flex-col items-center gap-2">
                      <iconify-icon icon="mdi:email-off-outline" class="text-xl text-gray-300" />
                      <span>No inquiries found</span>
                    </div>
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

// Reactive data
const searchQuery = ref('')
const statusFilter = ref('all')

// Sample inquiries data
const inquiries = ref([
  {
    id: 1,
    professor: {
      name: 'Dr. Sarah Smith',
      department: 'Mathematics',
      initials: 'SS'
    },
    subject: 'Calculus Integration Help',
    message: 'I need assistance with understanding integration techniques, particularly substitution and integration by parts. Could we schedule a meeting to go through some practice problems?',
    dateRelative: '2 hours ago',
    dateExact: 'January 15, 2024 at 2:30 PM',
    status: 'Pending',
    responseTime: null
  },
  {
    id: 2,
    professor: {
      name: 'Dr. Michael Johnson',
      dateRelative: '1 day ago',
      department: 'Physics',
      initials: 'MJ'
    },
    subject: 'Quantum Mechanics Lab',
    message: 'I\'m having trouble with the wave function calculations in our quantum mechanics lab. The probability density seems off in my calculations.',
    dateRelative: '1 day ago',
    dateExact: 'January 14, 2024 at 10:15 AM',
    status: 'Replied',
    responseTime: '1h 18m'
  },
  {
    id: 3,
    professor: {
      name: 'Dr. Emily Williams',
      department: 'Chemistry',
      initials: 'EW'
    },
    subject: 'Organic Chemistry Review',
    message: 'Could you help me review the mechanisms for nucleophilic substitution reactions? I have an exam next week.',
    dateRelative: '3 days ago',
    dateExact: 'January 12, 2024 at 4:45 PM',
    status: 'Replied',
    responseTime: '2h 5m'
  },
  {
    id: 4,
    professor: {
      name: 'Dr. Robert Brown',
      dateRelative: '2 days ago',
      department: 'Computer Science',
      initials: 'RB'
    },
    subject: 'Algorithm Analysis',
    message: 'I need help understanding time complexity analysis for recursive algorithms. Specifically, how to derive the Big O notation from recurrence relations.',
    dateRelative: '5 days ago',
    dateExact: 'January 10, 2024 at 11:20 AM',
    status: 'Unread',
    responseTime: null
  }
])

const openStatus = ref(false)
const statusFilterLabel = computed(() => {
  if (statusFilter.value === 'all') return 'All'
  return statusFilter.value.charAt(0).toUpperCase() + statusFilter.value.slice(1)
})
function setStatusFilter(val) {
  statusFilter.value = val
  openStatus.value = false
}

function onClickOutside(e) {
  const containers = document.querySelectorAll('.dropdown-container')
  let inside = false
  containers.forEach(c => { if (c.contains(e.target)) inside = true })
  if (!inside) openStatus.value = false
}
onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))

// Computed properties
const filteredInquiries = computed(() => {
  let filtered = inquiries.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(inquiry => 
      inquiry.professor.name.toLowerCase().includes(query) ||
      inquiry.subject.toLowerCase().includes(query) ||
      inquiry.message.toLowerCase().includes(query)
    )
  }

  // Filter by status
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(inquiry => 
      inquiry.status.toLowerCase() === statusFilter.value.toLowerCase()
    )
  }

  return filtered
})

// Helper function for status classes
const getStatusClasses = (status) => {
  const baseClasses = 'inline-flex px-2 py-1 text-xs font-semibold rounded-full'
  
  switch (status.toLowerCase()) {
    case 'replied':
      return `${baseClasses} bg-green-100 text-green-800`
    case 'pending':
      return `${baseClasses} bg-yellow-100 text-yellow-800`
    case 'unread':
      return `${baseClasses} bg-blue-100 text-blue-800`
    case 'closed':
      return `${baseClasses} bg-gray-100 text-gray-800`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<style scoped>
/* Dropdown Fade + Slide Down Transition (match ManageStudentConcerns.vue) */
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
</style>
