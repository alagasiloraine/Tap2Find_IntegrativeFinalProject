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
                  <th class="text-left px-6 py-4 font-semibold">Year Level and Section</th>
                  <th class="text-left px-6 py-4 font-semibold">Message</th>
                  <th class="text-left px-6 py-4 font-semibold">Submitted</th>
                  <th class="text-left px-6 py-4 font-semibold">Status</th>
                  <th class="text-left px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <!-- Skeleton rows -->
                <template v-if="loading">
                  <tr v-for="n in 4" :key="`sk-row-`+n">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-full bg-gray-200 animate-pulse"></div>
                        <div class="space-y-2">
                          <div class="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                          <div class="h-3 w-40 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="space-y-2">
                        <div class="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
                        <div class="h-3 w-44 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </td>
                    <td class="px-6 py-4"><div class="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></td>
                    <td class="px-6 py-4"><div class="h-5 w-24 bg-gray-200 rounded-full animate-pulse"></div></td>
                    <td class="px-6 py-4"><div class="h-8 w-24 bg-gray-200 rounded-lg animate-pulse"></div></td>
                  </tr>
                </template>
                <tr v-for="item in filteredConcerns" v-if="!loading" :key="item.id" class="hover:bg-gray-50">
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
                      {{ (item.yearLevel && item.section)
                        ? (item.yearLevel + ' • ' + item.section)
                        : (item.yearLevel || item.section || 'Not specified') }}
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
                        :disabled="isProcessing(item.id)"
                        class="group inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        :class="item.status === 'resolved' ? 'border-green-300 text-green-700 hover:bg-green-50' : 'border-amber-300 text-amber-700 hover:bg-amber-50'"
                      >
                        <template v-if="isProcessing(item.id)">
                          <svg class="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                          </svg>
                          <span class="hidden sm:inline text-xs">Processing...</span>
                        </template>
                        <template v-else>
                          <iconify-icon :icon="item.status === 'resolved' ? 'mdi:email-check-outline' : 'tabler:mail-up'" class="text-base" />
                          <span class="hidden sm:inline text-xs">{{ item.status === 'resolved' ? 'Resolved' : 'Resolve' }}</span>
                        </template>
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
                @click="openReplyModal"
                :disabled="!!modalProcessingAction"
                class="px-4 py-2 rounded-xl bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span v-if="modalProcessingAction==='decline'" class="inline-flex items-center gap-2"><svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>Processing...</span>
                <span v-else>Decline</span>
              </button>
              <button
                @click="acceptSelected()"
                :disabled="!!modalProcessingAction"
                class="px-4 py-2 rounded-xl bg-[#102A71] text-white font-medium hover:bg-[#102A71]/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span v-if="modalProcessingAction==='accept'" class="inline-flex items-center gap-2"><svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>Processing...</span>
                <span v-else>Accept</span>
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

    <!-- Reply Modal -->
    <Transition name="modal">
      <div v-if="isReplyModalOpen" class="fixed inset-0 z-[110] grid place-items-center">
        <div class="absolute inset-0 bg-black/40" @click="closeReplyModal"></div>
        <div class="relative w-[90%] max-w-md rounded-2xl shadow-xl overflow-hidden bg-white">
          <!-- Header -->
          <div class="flex items-center justify-between bg-gray-100 px-6 py-4">
            <div class="font-semibold text-gray-900">Reply to Student</div>
            <button @click="closeReplyModal" class="text-gray-500 hover:text-gray-700">
              <iconify-icon icon="mdi:close" class="text-2xl" />
            </button>
          </div>

          <!-- Body -->
          <div class="p-6">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Your Response</label>
              <textarea
                v-model="replyMessage"
                placeholder="Enter your response to the student..."
                rows="5"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              ></textarea>
            </div>

            <div class="flex justify-end gap-3">
              <button
                @click="closeReplyModal"
                class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                @click="sendReply"
                :disabled="!replyMessage.trim() || modalProcessingAction === 'decline'"
                class="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span v-if="modalProcessingAction === 'decline'" class="inline-flex items-center gap-2">
                  <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  Sending...
                </span>
                <span v-else>Send Response</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import ProfessorTopNav from '@/components/ProfessorTopNav.vue'
import api from '@/utils/api'

// Toast helper (bottom-right, unified design)
const showToast = (message, type = 'success', duration = 2600) => {
  let container = document.getElementById('t2f-toast-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 't2f-toast-container'
    container.style.position = 'fixed'
    container.style.bottom = '16px'
    container.style.right = '16px'
    container.style.zIndex = '9999'
    container.style.display = 'flex'
    container.style.flexDirection = 'column-reverse'
    container.style.gap = '10px'
    document.body.appendChild(container)
  }

  const colors = type === 'success'
    ? { border: '#34D399', text: '#065F46', iconBg: '#ECFDF5', iconFg: '#10B981', bar: '#6EE7B7' }
    : { border: '#F87171', text: '#7F1D1D', iconBg: '#FEF2F2', iconFg: '#EF4444', bar: '#FCA5A5' }

  const toast = document.createElement('div')
  toast.style.minWidth = '280px'
  toast.style.maxWidth = '460px'
  toast.style.background = '#FFFFFF'
  toast.style.border = `1.5px solid ${colors.border}`
  toast.style.borderRadius = '14px'
  toast.style.boxShadow = '0 12px 20px -6px rgba(0,0,0,0.12), 0 6px 10px -4px rgba(0,0,0,0.06)'
  toast.style.overflow = 'hidden'
  toast.style.opacity = '0'
  toast.style.transform = 'translateY(12px)'
  toast.style.transition = 'opacity 220ms ease, transform 220ms ease'

  const row = document.createElement('div')
  row.style.display = 'flex'
  row.style.alignItems = 'center'
  row.style.gap = '12px'
  row.style.padding = '12px 16px'

  const iconWrap = document.createElement('div')
  iconWrap.style.width = '26px'
  iconWrap.style.height = '26px'
  iconWrap.style.borderRadius = '50%'
  iconWrap.style.background = colors.iconBg
  iconWrap.style.display = 'flex'
  iconWrap.style.alignItems = 'center'
  iconWrap.style.justifyContent = 'center'
  iconWrap.style.flex = '0 0 auto'

  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  icon.setAttribute('viewBox', '0 0 24 24')
  icon.setAttribute('width', '16')
  icon.setAttribute('height', '16')
  icon.innerHTML = type === 'success'
    ? `<path d="M9 12.75 11.25 15 15 9.75" fill="none" stroke="${colors.iconFg}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<path d="M12 8v4m0 4h.01" fill="none" stroke="${colors.iconFg}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" fill="none" stroke="${colors.iconFg}" stroke-width="1.5" opacity="0.25"/>`
  iconWrap.appendChild(icon)

  const textBlock = document.createElement('div')
  textBlock.style.display = 'flex'
  textBlock.style.flexDirection = 'column'
  textBlock.style.gap = '2px'
  const title = document.createElement('div')
  title.textContent = type === 'success' ? 'SUCCESS' : 'ERROR'
  title.style.fontSize = '12px'
  title.style.fontWeight = '800'
  title.style.letterSpacing = '0.04em'
  title.style.color = colors.text
  const body = document.createElement('div')
  body.textContent = message
  body.style.fontSize = '14px'
  body.style.fontWeight = '600'
  body.style.color = '#111827'
  textBlock.appendChild(title)
  textBlock.appendChild(body)
  row.appendChild(iconWrap)
  row.appendChild(textBlock)

  const barWrap = document.createElement('div')
  barWrap.style.height = '2px'
  barWrap.style.background = 'transparent'
  barWrap.style.width = '100%'
  const bar = document.createElement('div')
  bar.style.height = '100%'
  bar.style.width = '100%'
  bar.style.background = colors.bar
  bar.style.transition = `width ${duration}ms linear`
  barWrap.appendChild(bar)

  toast.appendChild(row)
  toast.appendChild(barWrap)
  container.appendChild(toast)

  requestAnimationFrame(() => {
    toast.style.opacity = '1'
    toast.style.transform = 'translateY(0)'
    requestAnimationFrame(() => (bar.style.width = '0%'))
  })

  setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transform = 'translateY(8px)'
    setTimeout(() => {
      toast.remove()
      if (!container.childElementCount) container.remove()
    }, 240)
  }, duration)
}

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
const pollInterval = ref(null) // Added for polling

// Modal state
const isViewModalOpen = ref(false)
const selectedConcern = ref(null)
const isReplyModalOpen = ref(false)
const replyMessage = ref('')

// Per-item processing state and modal processing
const processingIds = ref(new Set())
const isProcessing = (id) => processingIds.value.has(id)
const setProcessing = (id, val) => {
  const s = new Set(processingIds.value)
  if (val) s.add(id); else s.delete(id)
  processingIds.value = s
}
const modalProcessingAction = ref('') // '', 'pending', 'resolved'

// Open reply modal
const openReplyModal = () => {
  isReplyModalOpen.value = true
}

// Close reply modal
const closeReplyModal = () => {
  isReplyModalOpen.value = false
  replyMessage.value = ''
}

// Send reply to student
const sendReply = async () => {
  if (!selectedConcern.value || !replyMessage.value.trim()) return
  
  try {
    modalProcessingAction.value = 'decline'
    
    console.log('📤 Sending reply to concern:', selectedConcern.value.id)
    console.log('📝 Reply message:', replyMessage.value)
    
    // Use 'declined' status (with 'd') to match backend expectation
    await updateConcernStatus(selectedConcern.value.id, 'declined', replyMessage.value)
    
    showToast('Response sent to student successfully', 'success')
    closeReplyModal()
    closeViewModal()
  } catch (error) {
    console.error('❌ Failed to send response:', error)
    console.error('📋 Error details:', error.response?.data)
    showToast('Failed to send response. Please try again.', 'error')
  } finally {
    modalProcessingAction.value = ''
  }
}

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
        section: inquiry.section || '',
        studentId: inquiry.studentId
      }))
      console.log('🔄 Polled concerns:', concerns.value.length)
    } else {
      console.error('API returned success: false', response.data)
    }
  } catch (error) {
    console.error('Error fetching concerns:', error)
    console.error('Error details:', error.response?.data)
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
  pollInterval.value = setInterval(fetchAllConcerns, 2000)
  console.log('🔄 Started polling concerns every 2 seconds')
}

const stopPolling = () => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
    pollInterval.value = null
    console.log('🛑 Stopped polling concerns')
  }
}

// Initial data load with loading state
const initializeData = async () => {
  try {
    loading.value = true
    await fetchAllConcerns()
  } finally {
    loading.value = false
  }
}

// Update concern status
const updateConcernStatus = async (concernId, status, replyMessage = '') => {
  try {
    const professorId = user.value.id
    console.log('Updating concern:', concernId, 'to status:', status, 'with reply:', replyMessage ? 'yes' : 'no')
    
    const requestData = { 
      status,
      professorId 
    }
    
    // Add reply message if provided
    if (replyMessage) {
      requestData.replyMessage = replyMessage
    }
    
    const response = await api.patch(`/professors/concerns/${concernId}`, requestData)
    
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
      (c.yearLevel && c.yearLevel.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (c.section && c.section.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
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
    case 'accepted':
      return 'bg-green-50 text-green-700 border-green-200'
    case 'replied':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'resolved':
      return 'bg-green-50 text-green-700 border-green-200'
    case 'declined':
      return 'bg-red-50 text-red-700 border-red-200'
    case 'in-progress':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    default:
      return 'bg-amber-50 text-amber-700 border-amber-200'
  }
}

const getStatusDotClass = (status) => {
  switch (status) {
    case 'accepted':
      return 'bg-green-500'
    case 'replied':
      return 'bg-blue-500'
    case 'resolved':
      return 'bg-green-500'
    case 'declined':
      return 'bg-red-500'
    case 'in-progress':
      return 'bg-blue-500'
    default:
      return 'bg-amber-500'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'accepted':
      return 'Accepted'
    case 'replied':
      return 'Replied'
    case 'resolved':
      return 'Resolved'
    case 'declined':
      return 'Declined'
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
    setProcessing(item.id, true)
    await updateConcernStatus(item.id, newStatus)
    showToast(newStatus === 'resolved' ? 'Concern marked as resolved' : 'Concern marked as pending', 'success')
  } catch (error) {
    console.error('Failed to update concern status:', error)
    showToast('Failed to update concern status. Please try again.', 'error')
  } finally {
    setProcessing(item.id, false)
  }
}

async function acceptSelected() {
  if (!selectedConcern.value) return
  try {
    modalProcessingAction.value = 'accepted'
    await updateConcernStatus(selectedConcern.value.id, 'accepted')
    showToast('Concern marked as resolved', 'success')
    closeViewModal()
  } catch (error) {
    console.error('Failed to resolve concern:', error)
    showToast('Failed to resolve concern. Please try again.', 'error')
  } finally {
    modalProcessingAction.value = ''
  }
}

async function declineSelected() {
  if (!selectedConcern.value) return
  try {
    modalProcessingAction.value = 'decline'
    await updateConcernStatus(selectedConcern.value.id, 'decline')
    showToast('Concern marked as pending', 'success')
    closeViewModal()
  } catch (error) {
    console.error('Failed to update concern status:', error)
    showToast('Failed to update concern status. Please try again.', 'error')
  } finally {
    modalProcessingAction.value = ''
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
    
    // Initialize data and start polling
    initializeData().then(() => {
      // Start polling after initial load is complete
      startPolling()
    })
  } else {
    console.error('No user found in localStorage')
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  // Clean up interval when component is destroyed
  stopPolling()
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