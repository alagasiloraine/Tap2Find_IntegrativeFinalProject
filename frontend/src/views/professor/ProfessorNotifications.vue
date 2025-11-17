<template>
  <div class="bg-white min-h-screen pb-28 md:pb-16 p-6 md:p-10">
    <!-- Header -->
    <div class="flex items-start justify-between relative">
      <div>
        <h1 class="text-4xl font-semibold text-gray-900">Notification</h1>
        <p class="text-base text-gray-500">
          You have 
          <span class="text-[#F5C400]">{{ unreadCount }} notification{{ unreadCount !== 1 ? 's' : '' }}</span> 
          today.
        </p>
      </div>
      <div class="relative" ref="menuRef">
        <button class="p-2 rounded-full hover:bg-gray-100" aria-label="Filter" @click="toggleMenu">
          <iconify-icon icon="mage:filter" class="text-2xl" />
        </button>
        <transition name="fade">
          <div v-if="menuOpen" class="absolute right-0 mt-2 w-44 rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden z-10">
            <button @click="selectFilter(null)" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">All</button>
            <button @click="selectFilter('today')" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Today</button>
            <button @click="selectFilter('week')" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">This Week</button>
            <button @click="selectFilter('month')" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">This Month</button>
          </div>
        </transition>
      </div>
    </div>

    <div class="mt-2"></div>

    <!-- Notifications List -->
    <div class="mt-6 space-y-6">
      <!-- Today Section -->
      <section v-if="todayNotifications.length > 0">
        <h2 class="text-lg font-semibold">Today</h2>
        <ul class="mt-1">
          <li 
            v-for="notification in todayNotifications" 
            :key="notification._id"
            class="flex items-start gap-3 py-3"
          >
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
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import api from '@/utils/api'

const selectedType = ref(null)
const loading = ref(true)
const menuOpen = ref(false)
const menuRef = ref(null)
const notifications = ref([])

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

// ✅ Filter logic (All / Today / This Week / This Month)
const filteredNotifications = computed(() => {
  let list = notifications.value || []

  // sort by newest first
  list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  if (selectedType.value === null) return list
  if (selectedType.value === 'today') return list.filter(n => n.createdAt && isToday(n.createdAt))
  if (selectedType.value === 'week') return list.filter(n => n.createdAt && isWithinLastDays(n.createdAt, 7))
  if (selectedType.value === 'month') return list.filter(n => n.createdAt && isWithinLastDays(n.createdAt, 30))
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

// ✅ Mark notification as read
const markAsRead = async (notificationId) => {
  try {
    const { data } = await api.patch(`/notification/mark-as-read/${notificationId}`)
    if (data.success) {
      // Update local state
      const notification = notifications.value.find(n => n._id === notificationId)
      if (notification) {
        notification.read = true
      }
    }
  } catch (error) {
    console.error('❌ Error marking notification as read:', error)
  }
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

// ✅ Fetch notifications (general + professor-specific)
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
    const { data } = await api.get(`/notification/get-notification?userId=${userId}&userRole=${userRole}`)

    if (data.success) {
      // Process notifications based on role
      notifications.value = (data.data || []).map((n) => ({
        ...n,
        isGeneral: !n.professorId || n.professorId === 'all', // add field for clarity
        isForCurrentRole: n.targetRole ? n.targetRole === userRole : true // Check if notification is for current user's role
      }))
      console.log(`✅ Loaded ${notifications.value.length} notifications for ${userRole}`)
    } else {
      console.warn('⚠️ Failed to fetch notifications:', data.message)
    }
  } catch (error) {
    console.error('❌ Error fetching notifications:', error)
  } finally {
    loading.value = false
  }
}

// ✅ On mount: load notifications
onMounted(() => {
  fetchNotifications()
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>