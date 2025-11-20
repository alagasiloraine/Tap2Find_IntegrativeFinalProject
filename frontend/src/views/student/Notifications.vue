<template>
  <div class="bg-white min-h-screen pb-28 md:pb-16 p-6 md:p-10">
    <!-- Header -->
    <div class="flex items-start justify-between relative">
      <div>
        <h1 class="text-4xl font-semibold text-gray-900">Notification</h1>
        <p class="text-base text-gray-500">
          You have 
          <span class="text-[#F5C400]">{{ totalTodayCount }} notification{{ totalTodayCount !== 1 ? 's' : '' }}</span> 
          today.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button class="px-3 py-2 text-sm rounded-lg border hover:bg-gray-50" @click="toggleSelectMode">{{ selectMode ? 'Cancel' : 'Select' }}</button>
        <button v-if="selectMode" class="px-3 py-2 text-sm rounded-lg border text-red-600 hover:bg-red-50 disabled:opacity-50" :disabled="selectedIds.length===0 || deletingSelected" @click="deleteSelected">Delete Selected</button>
        <button v-if="selectMode" class="px-3 py-2 text-sm rounded-lg border text-red-600 hover:bg-red-50 disabled:opacity-50" :disabled="deletingAll" @click="deleteAll">Delete All</button>
        <div class="relative" ref="menuRef">
          <button class="p-2 rounded-full hover:bg-gray-100" aria-label="Filter" @click="toggleMenu">
            <iconify-icon icon="mage:filter" class="text-2xl" />
          </button>
          <transition name="fade">
            <div v-if="menuOpen" class="absolute right-0 mt-2 w-44 rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden z-10">
              <button @click="selectFilter(null)" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">All</button>
              <button @click="selectFilter('today')" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Today</button>
              <button @click="selectFilter('week')" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">This Week</button>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <div class="mt-2"></div>

    <!-- Notifications List -->
    <div class="mt-6 space-y-6">
      <!-- Skeleton Loading -->
      <div v-if="loading" class="space-y-6 animate-pulse">
        <section>
          <div class="h-4 w-24 bg-gray-200 rounded mb-3"></div>
          <div v-for="n in 3" :key="n" class="flex items-start gap-3 py-3">
            <div class="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
            <div class="flex-1 space-y-2">
              <div class="h-3 w-40 bg-gray-200 rounded"></div>
              <div class="h-3 w-56 bg-gray-100 rounded"></div>
              <div class="h-2 w-24 bg-gray-100 rounded"></div>
            </div>
            <div class="w-5 h-5 bg-gray-200 rounded-full flex-shrink-0"></div>
          </div>
        </section>
      </div>

      <div v-else class="space-y-6">
      <!-- Today Section -->
      <section v-if="todayNotifications.length > 0">
        <h2 class="text-lg font-semibold">Today</h2>
        <ul class="mt-1">
          <li 
            v-for="notification in todayNotifications" 
            :key="notification._id"
            class="flex items-start gap-3 py-3"
          >
            <input v-if="selectMode" type="checkbox" class="mt-2" :value="notification._id" v-model="selectedIds" />
            <!-- System notifications icon -->
            <div v-if="notification.isGeneral" class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <iconify-icon icon="flowbite:laptop-code-solid" class="text-lg text-gray-700" />
            </div>
            <!-- User avatar or placeholder -->
            <img
              v-else
              :src="notification.avatar || '/profile.svg'"
              alt="avatar"
              class="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div class="flex-1">
              <p class="text-gray-900" :class="{'font-semibold': !notification.read}">
                {{ notification.title }}
              </p>
              <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatTimeAgo(notification.createdAt) }}</p>
            </div>
            <div class="flex-shrink-0">
              <button
                @click="markAsRead(notification._id)"
                class="text-gray-400 hover:text-gray-600"
                v-if="!notification.read"
              >
                <iconify-icon icon="mdi:check-circle-outline" />
              </button>
              <iconify-icon v-else icon="mdi:check-circle" class="text-green-500" />
            </div>
          </li>
        </ul>
      </section>

      <!-- Yesterday Section -->
      <section v-if="yesterdayNotifications.length > 0">
        <h2 class="text-lg font-semibold">Yesterday</h2>
        <ul class="mt-1">
          <li 
            v-for="notification in yesterdayNotifications" 
            :key="notification._id"
            class="flex items-start gap-3 py-3"
          >
            <input v-if="selectMode" type="checkbox" class="mt-2" :value="notification._id" v-model="selectedIds" />
            <div v-if="notification.isGeneral" class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <iconify-icon icon="flowbite:laptop-code-solid" class="text-lg text-gray-700" />
            </div>
            <img
              v-else
              :src="notification.avatar || '/profile.svg'"
              alt="avatar"
              class="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div class="flex-1">
              <p class="text-gray-900" :class="{'font-semibold': !notification.read}">
                {{ notification.title }}
              </p>
              <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatTimeAgo(notification.createdAt) }}</p>
            </div>
            <div class="flex-shrink-0">
              <button
                @click="markAsRead(notification._id)"
                class="text-gray-400 hover:text-gray-600"
                v-if="!notification.read"
              >
                <iconify-icon icon="mdi:check-circle-outline" />
              </button>
              <iconify-icon v-else icon="mdi:check-circle" class="text-green-500" />
            </div>
          </li>
        </ul>
      </section>

      <!-- Older Section -->
      <section v-if="olderNotifications.length > 0">
        <h2 class="text-lg font-semibold">Older</h2>
        <ul class="mt-1">
          <li 
            v-for="notification in olderNotifications" 
            :key="notification._id"
            class="flex items-start gap-3 py-3"
          >
            <input v-if="selectMode" type="checkbox" class="mt-2" :value="notification._id" v-model="selectedIds" />
            <div v-if="notification.isGeneral" class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <iconify-icon icon="flowbite:laptop-code-solid" class="text-lg text-gray-700" />
            </div>
            <img
              v-else
              :src="notification.avatar || '/profile.svg'"
              alt="avatar"
              class="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div class="flex-1">
              <p class="text-gray-900" :class="{'font-semibold': !notification.read}">
                {{ notification.title }}
              </p>
              <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatDate(notification.createdAt) }}</p>
            </div>
            <div class="flex-shrink-0">
              <button
                @click="markAsRead(notification._id)"
                class="text-gray-400 hover:text-gray-600"
                v-if="!notification.read"
              >
                <iconify-icon icon="mdi:check-circle-outline" />
              </button>
              <iconify-icon v-else icon="mdi:check-circle" class="text-green-500" />
            </div>
          </li>
        </ul>
      </section>

      <!-- Empty State -->
      <div v-if="filteredNotifications.length === 0" class="text-center py-12">
        <iconify-icon icon="mingcute:notification-off-line" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
        <p class="text-gray-600">You currently have no notifications.</p>
      </div>
      </div>
    </div>

    <!-- Delete Selected Confirmation Modal -->
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showDeleteSelectedModal" class="fixed inset-0 z-[9999]">
        <div class="absolute inset-0 bg-black/40" @click="cancelDeleteSelected"></div>
        <div class="relative w-full h-full flex items-center justify-center p-4">
          <div class="bg-white rounded-xl w-full max-w-sm p-6 shadow-xl text-center">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Delete selected notifications?</h3>
            <p class="text-sm text-gray-600 mb-5">Are you sure you want to delete {{ selectedIds.length }} selected notification{{ selectedIds.length !== 1 ? 's' : '' }}?</p>
            <div class="flex gap-3 justify-center">
              <button @click="cancelDeleteSelected" class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</button>
              <button @click="confirmDeleteSelected" :disabled="deletingSelected" class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60">{{ deletingSelected ? 'Deleting…' : 'Delete Selected' }}</button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Delete All Confirmation Modal -->
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showDeleteAllModal" class="fixed inset-0 z-[9999]">
        <div class="absolute inset-0 bg-black/40" @click="cancelDeleteAll"></div>
        <div class="relative w-full h-full flex items-center justify-center p-4">
          <div class="bg-white rounded-xl w-full max-w-sm p-6 shadow-xl text-center">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Delete all notifications?</h3>
            <p class="text-sm text-gray-600 mb-5">Are you sure you want to delete all the notifications? This action cannot be undone.</p>
            <div class="flex gap-3 justify-center">
              <button @click="cancelDeleteAll" class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</button>
              <button @click="confirmDeleteAll" :disabled="deletingAll" class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60">{{ deletingAll ? 'Deleting…' : 'Delete All' }}</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import StudentTopNav from '@/components/StudentTopNav.vue'
import { useNotifications } from '@/composables/useNotifications'
import api from '@/utils/api'

const selectedType = ref(null)
const loading = ref(true)
const menuOpen = ref(false)
const menuRef = ref(null)
const { notifications, markAsRead } = useNotifications()
const selectMode = ref(false)
const selectedIds = ref([])
const deletingSelected = ref(false)
const deletingAll = ref(false)
const showDeleteAllModal = ref(false)
const showDeleteSelectedModal = ref(false)
const pollInterval = ref(null) // Added for polling

// Toast helper (bottom-right, white card, icon + title, progress line)
const showToast = (message, type = 'success', duration = 2800) => {
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

// 🧠 Utility: check if date is today
const isToday = (date) => {
  const d = new Date(date)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

// 🧠 Utility: check if date is yesterday
const isYesterday = (date) => {
  const d = new Date(date)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return (
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate()
  )
}

// 🧠 Utility: check if within X days
const isWithinLastDays = (date, days) => {
  const d = new Date(date).getTime()
  const now = Date.now()
  return now - d <= days * 24 * 60 * 60 * 1000
}

// ✅ Filter logic (All / Today / This Week)
const filteredNotifications = computed(() => {
  let list = notifications.value || []

  // sort by newest first
  list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  if (selectedType.value === null) return list
  if (selectedType.value === 'today') return list.filter(n => n.createdAt && isToday(n.createdAt))
  if (selectedType.value === 'week') return list.filter(n => n.createdAt && isWithinLastDays(n.createdAt, 7))
  return list
})

// Group notifications by time periods
const todayNotifications = computed(() => {
  return filteredNotifications.value.filter(n => n.createdAt && isToday(n.createdAt))
})

const yesterdayNotifications = computed(() => {
  return filteredNotifications.value.filter(n => n.createdAt && isYesterday(n.createdAt))
})

const olderNotifications = computed(() => {
  return filteredNotifications.value.filter(n => n.createdAt && !isToday(n.createdAt) && !isYesterday(n.createdAt))
})

// Count unread notifications for today
const unreadCount = computed(() => {
  return todayNotifications.value.filter(n => !n.read).length
})

// Count ALL notifications for today (read + unread)
const totalTodayCount = computed(() => {
  return todayNotifications.value.length
})

// Filter menu functions
function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function selectFilter(val) {
  selectedType.value = val
  menuOpen.value = false
}

function onClickOutside(e) {
  if (!menuRef.value) return
  if (!menuRef.value.contains(e.target)) {
    menuOpen.value = false
  }
}

// Selection mode handlers
function toggleSelectMode() {
  selectMode.value = !selectMode.value
  if (!selectMode.value) selectedIds.value = []
}

const deleteSelected = () => {
  if (selectedIds.value.length === 0) return
  showDeleteSelectedModal.value = true
}

const cancelDeleteSelected = () => {
  showDeleteSelectedModal.value = false
}

const confirmDeleteSelected = async () => {
  try {
    if (selectedIds.value.length === 0) return
    deletingSelected.value = true
    const count = selectedIds.value.length
    await api.post('/notification/delete', { ids: selectedIds.value })
    notifications.value = notifications.value.filter(n => !selectedIds.value.includes(n._id))
    selectedIds.value = []
    showToast(`${count} notification${count !== 1 ? 's' : ''} deleted`, 'success')
  } catch (error) {
    console.error('❌ Error deleting selected notifications:', error)
    showToast('Failed to delete selected notifications', 'error')
  } finally {
    deletingSelected.value = false
    showDeleteSelectedModal.value = false
  }
}

const deleteAll = () => {
  showDeleteAllModal.value = true
}

const cancelDeleteAll = () => {
  showDeleteAllModal.value = false
}

const confirmDeleteAll = async () => {
  try {
    deletingAll.value = true
    const storedUser = localStorage.getItem('user')
    if (!storedUser) return console.error('❌ No user found in localStorage')
    const user = JSON.parse(storedUser)
    const userId = user._id || user.id
    const userRole = user.role
    await api.post('/notification/delete-all', { userId, userRole })
    notifications.value = []
    selectedIds.value = []
    showToast('All notifications deleted', 'success')
  } catch (error) {
    console.error('❌ Error deleting all notifications:', error)
    showToast('Failed to delete all notifications', 'error')
  } finally {
    deletingAll.value = false
    showDeleteAllModal.value = false
  }
}

// ✅ Helper for dynamic icons
const getNotificationIcon = (type) => {
  if (type === 'assignment') return 'lucide:file-text'
  if (type === 'grade') return 'lucide:chart-bar'
  if (type === 'system') return 'flowbite:laptop-code-solid'
  return 'lucide:message-square'
}

// ✅ Format notification date
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString()
}

// ✅ Format time ago
const formatTimeAgo = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}min ago`
  if (diffHours < 24) return `${diffHours}hr ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(dateStr)
}

// ✅ Fetch notifications (general + user-specific)
const fetchNotifications = async () => {
  try {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      console.error('❌ No user found in localStorage')
      return
    }

    const user = JSON.parse(storedUser)
    const userId = user._id || user.id
    const userRole = user.role // Get user role

    // Fetch notifications from backend with role parameter
    const { data } = await api.get(`/notification/get-all-notifications?userId=${userId}&userRole=${userRole}&onlyUnread=false`)

    if (data.success) {
      // General notifications → seen by all
      // Personalized → specific to user
      notifications.value = (data.data || []).map((n) => ({
        ...n,
        isGeneral: !n.studentId || n.studentId === 'all', // add field for clarity
      }))
      console.log(`✅ Loaded ${notifications.value.length} notifications for ${userRole}`)
    } else {
      console.warn('⚠️ Failed to fetch notifications:', data.message)
    }
  } catch (error) {
    console.error('❌ Error fetching notifications:', error)
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
  pollInterval.value = setInterval(fetchNotifications, 2000)
  console.log('🔄 Started polling notifications every 2 seconds')
}

const stopPolling = () => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
    pollInterval.value = null
    console.log('🛑 Stopped polling notifications')
  }
}

// Initial data load with loading state
const initializeData = async () => {
  try {
    loading.value = true
    await fetchNotifications()
  } finally {
    loading.value = false
  }
}

// ✅ On mount: load notifications
onMounted(() => {
  document.addEventListener('click', onClickOutside)
  
  // Initialize data and start polling
  initializeData().then(() => {
    // Start polling after initial load is complete
    startPolling()
  })
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
  // Clean up interval when component is destroyed
  stopPolling()
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>