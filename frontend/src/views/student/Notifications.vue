<template>
  <div class="bg-white min-h-screen pb-20 md:pb-8 p-4 md:p-4">
    <!-- Top Bar with Notifications and Profile -->
    <StudentTopNav />

    <!-- Content Division -->
    <div class="px-4 md:px-6 pt-12 min-h-0">
      <!-- Page Header -->


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
            :key="notification.id"
            class="bg-white border border-gray-200 rounded-lg p-4 transition-shadow"
            :class="[notification.read ? 'opacity-75' : '']"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0 mr-4">
                <div v-if="notification.type === 'system'" class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <iconify-icon icon="flowbite:laptop-code-solid" class="text-2xl text-gray-700" />
                </div>
                <img v-else :src="notification.avatar || '/profile.svg'" alt="avatar" class="w-12 h-12 rounded-full object-cover" />
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900">{{ notification.title }}</p>
                <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
                <p class="text-xs text-gray-500 mt-2">{{ notification.time }}</p>
              </div>
              <div class="flex-shrink-0 ml-4">
                <button
                  @click="markAsRead(notification.id)"
                  class="text-gray-400 hover:text-gray-600"
                  v-if="!notification.read"
                >
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
import { ref, computed } from 'vue'
import StudentTopNav from '@/components/StudentTopNav.vue'
import { useNotifications } from '@/composables/useNotifications'

const selectedType = ref(null)
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
  if (selectedType.value === null) return notifications.value
  if (selectedType.value === 'today') return notifications.value.filter(n => n.createdAt && isToday(n.createdAt))
  if (selectedType.value === 'week') return notifications.value.filter(n => n.createdAt && isWithinLastDays(n.createdAt, 7))
  return notifications.value
})

const filterByType = (type) => {
  selectedType.value = type
}

const getNotificationIcon = (type) => {
  if (type === 'assignment') return 'lucide:file-text'
  if (type === 'grade') return 'lucide:chart-bar'
  return 'lucide:message-square'
}
</script>
