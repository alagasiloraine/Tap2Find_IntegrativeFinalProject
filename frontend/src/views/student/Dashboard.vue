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
            <div class="rounded-xl border border-gray-200 p-6 h-80" style="background: linear-gradient(180deg, #5e89ff, #102a71);">
              <h3 class="text-xl font-semibold text-white mb-4">Professor Availability Trend Chart</h3>
              <div class="h-64">
                <ProfessorAvailabilityChart />
              </div>
            </div>
          </div>

          <!-- Status Cards Grid (2x2) -->
          <div class="grid grid-cols-2 gap-4">
            <!-- Available Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200 h-full flex items-center">
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
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200 h-full flex items-center">
              <div class="flex items-center w-full">
                <div class="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <iconify-icon icon="stash:person" class="text-3xl text-orange-500"></iconify-icon>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">Busy</p>
                  <p class="text-2xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </div>

            <!-- Not Available Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200 h-full flex items-center">
              <div class="flex items-center w-full">
                <div class="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <iconify-icon icon="stash:person" class="text-3xl text-red-500"></iconify-icon>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">Not Available</p>
                  <p class="text-2xl font-bold text-gray-900">5</p>
                </div>
              </div>
            </div>

            <!-- Inquiries Sent Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200 h-full flex items-center">
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
        <div class="bg-white rounded-xl shadow p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 class="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">Recent Inquiries</h3>
            
            <!-- Search and Filters -->
            <div class="flex flex-col sm:flex-row gap-3">
              <!-- Search -->
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input 
                  v-model="searchQuery" 
                  type="text" 
                  placeholder="Search by professor or subject..."
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <!-- Status Filter -->
              <select 
                v-model="statusFilter" 
                class="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="replied">Replied</option>
                <option value="unread">Unread</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professor</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject/Message</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Sent</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="inquiry in filteredInquiries" :key="inquiry.id">
                  <!-- Professor Column -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span class="text-sm font-medium text-blue-600">{{ inquiry.professor.initials }}</span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ inquiry.professor.name }}</div>
                        <div class="text-sm text-gray-500">{{ inquiry.professor.department }}</div>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Subject/Message Column -->
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 font-medium">{{ inquiry.subject }}</div>
                    <div 
                      class="text-sm text-gray-500 mt-1 line-clamp-2 cursor-help" 
                      :title="inquiry.message"
                    >
                      {{ inquiry.message }}
                    </div>
                  </td>
                  
                  <!-- Date Sent Column -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900" :title="inquiry.dateExact">{{ inquiry.dateRelative }}</div>
                  </td>
                  
                  <!-- Status Column -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      :class="getStatusClasses(inquiry.status)"
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    >
                      {{ inquiry.status }}
                    </span>
                  </td>
                  
                  <!-- Response Column -->
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ inquiry.responseTime || '—' }}
                  </td>
                  
                  <!-- Actions Column -->
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-3">
                      <!-- View Button -->
                      <button 
                        class="flex items-center space-x-1 text-blue-600 hover:text-blue-900 transition-colors"
                        title="View inquiry"
                      >
                        <iconify-icon icon="hugeicons:view" class="w-4 h-4"></iconify-icon>
                        <span>View</span>
                      </button>
                      
                      <!-- Reply Button -->
                      <button 
                        v-if="inquiry.status === 'Replied'" 
                        class="flex items-center space-x-1 text-green-600 hover:text-green-900 transition-colors"
                        title="Reply to inquiry"
                      >
                        <iconify-icon icon="majesticons:open-line" class="w-4 h-4"></iconify-icon>
                        <span>Reply</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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
    status: 'Closed',
    responseTime: '2h 5m'
  },
  {
    id: 4,
    professor: {
      name: 'Dr. Robert Brown',
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
