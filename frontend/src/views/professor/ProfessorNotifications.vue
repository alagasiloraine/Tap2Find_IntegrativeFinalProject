<template>
  <div class="bg-white min-h-screen pb-20 md:pb-8 p-4 md:p-4">
    <ProfessorTopNav />
    <div class="px-4 md:px-6 pt-6 min-h-0">
      <div class="max-w-4xl mx-auto">
        <!-- Search -->
        <div class="relative mb-5">
          <iconify-icon icon="fluent:search-16-filled" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input v-model="searchQuery" type="text" placeholder="Search" class="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#102A71]" />
        </div>

        <!-- Tabs -->
        <div class="flex items-center justify-between border-b">
          <div class="flex items-center gap-10">
            <button @click="filterByType(null)" class="relative pb-3 text-base font-medium" :class="selectedType === null ? 'text-black' : 'text-gray-500 hover:text-gray-700'">
              All
              <span v-if="unreadCount > 0" class="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-black text-white text-[10px]">{{ unreadCount }}</span>
              <span v-if="selectedType === null" class="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></span>
            </button>
            <button @click="filterByType('today')" class="relative pb-3 text-base font-medium" :class="selectedType === 'today' ? 'text-black' : 'text-gray-500 hover:text-gray-700'">
              Today
              <span v-if="selectedType === 'today'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></span>
            </button>
            <button @click="filterByType('week')" class="relative pb-3 text-base font-medium" :class="selectedType === 'week' ? 'text-black' : 'text-gray-500 hover:text-gray-700'">
              This Week
              <span v-if="selectedType === 'week'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></span>
            </button>
          </div>
          <button @click="markAllAsRead" class="text-base text-black underline pb-3">Mark all as read</button>
        </div>

        <!-- List -->
        <div class="mt-3 divide-y">
          <div v-for="notification in filteredNotifications" :key="notification.id" class="py-3">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start gap-3 min-w-0">
                <img :src="notification.avatar || '/profile.svg'" alt="avatar" class="w-10 h-10 rounded-full object-cover" />
                <div class="min-w-0">
                  <!-- Line 1: Student Name from Section -->
                  <div class="font-semibold truncate">{{ displayTitle(notification) }}</div>
                  <!-- Line 2: Message text -->
                  <div class="text-sm text-gray-600 truncate">{{ displayMessage(notification) }}</div>
                </div>
              </div>
              <!-- Right: time (e.g., now) -->
              <div class="text-xs text-gray-500 whitespace-nowrap">{{ relativeTime(notification.createdAt) }}</div>
            </div>
          </div>

          <div v-if="filteredNotifications.length === 0" class="text-center py-12">
            <iconify-icon icon="mingcute:notification-off-line" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p class="text-gray-600">You currently have no notifications.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProfessorTopNav from '@/components/ProfessorTopNav.vue'
import { useNotifications } from '@/composables/useNotifications'

const selectedType = ref(null)
const searchQuery = ref('')
const { notifications, markAsRead } = useNotifications()

const isToday = (date) => {
  const d = new Date(date)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}

const isWithinLastDays = (date, days) => {
  const d = new Date(date).getTime()
  const now = Date.now()
  return now - d <= days * 24 * 60 * 60 * 1000
}

const filteredNotifications = computed(() => {
  let list = notifications.value
  if (selectedType.value === 'today') list = list.filter(n => n.createdAt && isToday(n.createdAt))
  else if (selectedType.value === 'week') list = list.filter(n => n.createdAt && isWithinLastDays(n.createdAt, 7))

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(n =>
      (n.name && n.name.toLowerCase().includes(q)) ||
      (n.section && n.section.toLowerCase().includes(q)) ||
      (n.title && n.title.toLowerCase().includes(q)) ||
      (n.message && n.message.toLowerCase().includes(q))
    )
  }
  return list
})

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const filterByType = (type) => {
  selectedType.value = type
}

const markAllAsRead = () => {
  notifications.value.forEach(n => { if (!n.read) markAsRead(n.id) })
}

const relativeTime = (date) => {
  if (!date) return 'now'
  const d = new Date(date).getTime()
  const diff = Date.now() - d
  if (diff < 60 * 1000) return 'now'
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.floor(hrs / 24)
  return `${days}d`
}

const displayTitle = (n) => {
  const base = n && (n.name || n.title) ? (n.name || n.title) : ''
  const section = n && n.section ? ` from ${n.section}` : ''
  return `${base}${section}`.trim()
}

const displayMessage = (n) => {
  const defaultMsg = "Prof, nakaset kayo as Busy. Okay lang po bang mag-leave ng concern? When’s a good time?"
  return n && n.message ? n.message : defaultMsg
}
</script>
