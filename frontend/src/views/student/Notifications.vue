<template>
  <div class="bg-white min-h-screen pb-20 md:pb-8 p-4 md:p-4">
    <!-- Top Bar with Notifications and Profile -->
    <StudentTopNav />

    <!-- Content Division -->
    <div class="px-4 md:px-6 pt-12 min-h-0">
      <!-- Notifications Content -->
      <div>
        <div class="w-full">
          <!-- Filter Tabs: All, Today, This Week -->
          <div class="flex space-x-4 mb-6">
            <button
              @click="filterByType(null)"
              class="px-4 py-2 rounded-full font-medium transition-colors"
              :class="selectedType === null ? 'bg-[#102A71] text-white' : 'text-gray-500 hover:text-gray-700'"
            >
              All
            </button>
            <button
              @click="filterByType('today')"
              class="px-4 py-2 rounded-full font-medium transition-colors"
              :class="selectedType === 'today' ? 'bg-[#102A71] text-white' : 'text-gray-500 hover:text-gray-700'"
            >
              Today
            </button>
            <button
              @click="filterByType('week')"
              class="px-4 py-2 rounded-full font-medium transition-colors"
              :class="selectedType === 'week' ? 'bg-[#102A71] text-white' : 'text-gray-500 hover:text-gray-700'"
            >
              This Week
            </button>
          </div>

          <!-- Notifications List -->
          <div class="space-y-3">
            <div
              v-for="notification in filteredNotifications"
              :key="notification._id"
              class="bg-white border border-gray-200 rounded-lg p-4 transition-shadow"
              :class="[notification.read ? 'opacity-75' : '']"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0 mr-4">
                  <!-- System notifications icon -->
                  <div v-if="notification.isGeneral" class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <iconify-icon icon="flowbite:laptop-code-solid" class="text-2xl text-gray-700" />
                  </div>
                  <!-- User avatar or placeholder -->
                  <img
                    v-else
                    :src="notification.avatar || '/profile.svg'"
                    alt="avatar"
                    class="w-12 h-12 rounded-full object-cover"
                  />
                </div>

                <div class="flex-1">
                  <p class="font-medium text-gray-900">{{ notification.title }}</p>
                  <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
                  <p class="text-xs text-gray-500 mt-2">{{ formatDate(notification.createdAt) }}</p>
                </div>

                <div class="flex-shrink-0 ml-4">
                  <button
                    @click="markAsRead(notification._id)"
                    class="text-gray-400 hover:text-gray-600"
                    v-if="!notification.read"
                  >
                    <iconify-icon icon="mdi:check-circle-outline" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredNotifications.length === 0" class="text-center py-12">
              <iconify-icon icon="mingcute:notification-off-line" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 class="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p class="text-gray-600">You currently have no notifications.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StudentTopNav from '@/components/StudentTopNav.vue'
import { useNotifications } from '@/composables/useNotifications'
import api from '@/utils/api'

const selectedType = ref(null)
const loading = ref(true)
const { notifications, markAsRead } = useNotifications()

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

const filterByType = (type) => {
  selectedType.value = type
}

// ✅ Helper for dynamic icons
const getNotificationIcon = (type) => {
  if (type === 'assignment') return 'lucide:file-text'
  if (type === 'grade') return 'lucide:chart-bar'
  if (type === 'system') return 'flowbite:laptop-code-solid'
  return 'lucide:message-square'
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
    const studentId = user._id || user.id

    // Fetch notifications from backend
    const { data } = await api.get(`/notification/get-notification?studentId=${studentId}`)

    if (data.success) {
      // General notifications → seen by all
      // Personalized → specific to user
      notifications.value = (data.data || []).map((n) => ({
        ...n,
        isGeneral: !n.studentId || n.studentId === 'all', // add field for clarity
      }))
    } else {
      console.warn('⚠️ Failed to fetch notifications:', data.message)
    }
  } catch (error) {
    console.error('❌ Error fetching notifications:', error)
  } finally {
    loading.value = false
  }
}

// ✅ Format notification date
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString()
}

// ✅ On mount: load notifications
onMounted(() => {
  fetchNotifications()
})
</script>
