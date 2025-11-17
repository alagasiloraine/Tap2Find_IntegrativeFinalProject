<template>
  <div class="px-4 md:px-2 py-4 flex justify-between items-center rounded-lg mx-4 mt-6" :class="{ 'gap-32': isDashboard }">
    <!-- Navigation Menu Info -->
    <div class="flex-1">
      <h1 class="text-4xl font-semibold text-gray-900">{{ currentPageTitle }}</h1>
      <p class="text-base text-gray-500">{{ currentPageDescription }}</p>
    </div>

    <!-- Right Side - Notifications and Profile -->
    <div class="flex items-center space-x-1">
      <!-- Notifications -->
      <div class="relative">
        <button
          @click="toggleNotifications"
          class="flex items-center justify-center w-12 h-12 text-2xl text-gray-600 hover:text-gray-600 relative transition-colors"
        >
          <iconify-icon
            :icon="showNotifications ? 'ion:notifications' : 'ion:notifications-outline'"
            class="h-5 w-5"
          />
          <span
            v-if="count > 0"
            class="absolute -top-1 -right-1 h-5 w-5 bg-[#F5C400] text-white text-xs rounded-full flex items-center justify-center"
          >
            {{ count }}
          </span>
        </button>

        <!-- 🔽 Notifications Dropdown -->
        <Transition name="dropdown">
          <div
            v-if="showNotifications"
            class="absolute right-0 mt-2 w-[420px] bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            <!-- Header -->
            <div class="px-6 py-4 flex justify-between items-center border-b border-gray-100">
              <h3 class="text-xl font-bold text-gray-900">Notifications</h3>
              <button @click="clearAll" class="text-sm text-gray-500 hover:text-gray-700">
                Clear All
              </button>
            </div>

            <!-- Notifications List -->
            <div class="max-h-96 overflow-y-auto px-6 py-2">
              <template v-if="notifications.length > 0">
                <!-- TODAY -->
                <div v-if="groupedNotifications.today.length">
                  <p class="text-sm text-gray-500 font-semibold mt-2 mb-1">Today</p>
                  <ul>
                    <li
                      v-for="n in groupedNotifications.today"
                      :key="n._id"
                      class="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <div
                          v-if="n.isGeneral"
                          class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                        >
                          <iconify-icon icon="flowbite:laptop-code-solid" class="text-lg text-gray-700" />
                        </div>
                        <img
                          v-else
                          :src="n.avatar || '/profile.svg'"
                          alt="avatar"
                          class="w-10 h-10 rounded-full object-cover"
                        />
                      </div>

                      <div class="flex-1">
                        <p class="text-gray-900 font-medium">{{ n.title }}</p>
                        <p class="text-sm text-gray-600">{{ n.message }}</p>
                        <p class="text-xs text-gray-500 mt-1">{{ formatDate(n.createdAt) }}</p>
                      </div>

                      <button
                        v-if="!n.read"
                        @click.stop="markAsRead(n._id)"
                        class="text-gray-400 hover:text-gray-600"
                      >
                        <iconify-icon icon="mdi:check-circle-outline" />
                      </button>
                    </li>
                  </ul>
                </div>

                <!-- YESTERDAY -->
                <div v-if="groupedNotifications.yesterday.length">
                  <p class="text-sm text-gray-500 font-semibold mt-4 mb-1">Yesterday</p>
                  <ul>
                    <li
                      v-for="n in groupedNotifications.yesterday"
                      :key="n._id"
                      class="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <div
                          v-if="n.isGeneral"
                          class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                        >
                          <iconify-icon icon="flowbite:laptop-code-solid" class="text-lg text-gray-700" />
                        </div>
                        <img
                          v-else
                          :src="n.avatar || '/profile.svg'"
                          alt="avatar"
                          class="w-10 h-10 rounded-full object-cover"
                        />
                      </div>

                      <div class="flex-1">
                        <p class="text-gray-900 font-medium">{{ n.title }}</p>
                        <p class="text-sm text-gray-600">{{ n.message }}</p>
                        <p class="text-xs text-gray-500 mt-1">{{ formatDate(n.createdAt) }}</p>
                      </div>

                      <button
                        v-if="!n.read"
                        @click.stop="markAsRead(n._id)"
                        class="text-gray-400 hover:text-gray-600"
                      >
                        <iconify-icon icon="mdi:check-circle-outline" />
                      </button>
                    </li>
                  </ul>
                </div>

                <!-- EARLIER -->
                <div v-if="groupedNotifications.earlier.length">
                  <p class="text-sm text-gray-500 font-semibold mt-4 mb-1">Earlier</p>
                  <ul>
                    <li
                      v-for="n in groupedNotifications.earlier"
                      :key="n._id"
                      class="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <div
                          v-if="n.isGeneral"
                          class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                        >
                          <iconify-icon icon="flowbite:laptop-code-solid" class="text-lg text-gray-700" />
                        </div>
                        <img
                          v-else
                          :src="n.avatar || '/profile.svg'"
                          alt="avatar"
                          class="w-10 h-10 rounded-full object-cover"
                        />
                      </div>

                      <div class="flex-1">
                        <p class="text-gray-900 font-medium">{{ n.title }}</p>
                        <p class="text-sm text-gray-600">{{ n.message }}</p>
                        <p class="text-xs text-gray-500 mt-1">{{ formatDate(n.createdAt) }}</p>
                      </div>

                      <button
                        v-if="!n.read"
                        @click.stop="markAsRead(n._id)"
                        class="text-gray-400 hover:text-gray-600"
                      >
                        <iconify-icon icon="mdi:check-circle-outline" />
                      </button>
                    </li>
                  </ul>
                </div>
              </template>

              <!-- Empty State -->
              <div v-else class="text-center py-10 text-gray-500">
                <iconify-icon icon="mingcute:notification-off-line" class="h-10 w-10 mx-auto mb-2" />
                <p>No notifications available.</p>
              </div>
            </div>

            <!-- Footer -->
            <div
              v-if="notifications.length >= 5"
              class="px-6 py-3 border-t border-gray-100 text-right bg-white rounded-b-lg"
            >
              <router-link to="/student/notifications" class="text-sm text-[#102A71] hover:underline">
                View all
              </router-link>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Profile -->
      <div class="relative">
        <button
          @click="toggleProfileMenu"
          class="flex items-center space-x-3 p-2  rounded-lg transition-colors"
        >
          <!-- Profile Picture -->
          <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center overflow-hidden">
            <span class="text-sm font-semibold text-blue-600">{{ initials }}</span>
          </div>
          
          <!-- Profile Info -->
          <div class="flex flex-col items-start">
            <span class="text-sm font-semibold text-gray-900">{{ user.firstName }} {{ user.lastName }}</span>
            <span class="text-xs text-gray-500">{{ user.emailAddress }}</span>
          </div>
          
          <!-- Dropdown Icon -->
          <iconify-icon icon="lucide:chevron-down" class="h-4 w-4 text-gray-400" />
        </button>

        <!-- Profile Dropdown Menu -->
        <Transition name="dropdown">
          <div
            v-if="showProfileMenu"
            class="absolute right-0 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            <div class="py-1">
              <router-link
                to="/student/profile"
                class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                @click="showProfileMenu = false"
              >
                <iconify-icon icon="lucide:user" class="mr-2 h-4 w-4" />
                View Profile
              </router-link>
              <div class="border-t border-gray-100"></div>
              <button
                @click="showSignOutModal = true"
                class="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
              >
                <iconify-icon icon="lucide:log-out" class="mr-2 h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>

  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="showSignOutModal" class="fixed inset-0 z-[9999]">
      <div class="absolute inset-0 bg-black/40"></div>
      <div class="relative w-full h-full flex items-center justify-center p-4">
        <div class="bg-white rounded-xl w-full max-w-sm p-6 shadow-xl text-center">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Sign out</h3>
          <p class="text-sm text-gray-600 mb-5">Are you sure you want to sign out?</p>
          <div class="flex gap-3 justify-center">
            <button @click="showSignOutModal = false" class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</button>
            <button @click="confirmSignOut" class="px-4 py-2 rounded-lg bg-[#102A71] text-white hover:bg-[#102A71]/90">Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import api from '@/utils/api'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()

const showProfileMenu = ref(false)
const showNotifications = ref(false)
const showSignOutModal = ref(false)

const user = ref({
  firstName: '',
  lastName: '',
  role: '',
  emailAddress: ''
})

// --- Use global composable store ---
const { notifications, count, addNotification, markAsRead, clearAll } = useNotifications()

// --- Fetch notifications from backend ---
const fetchNotifications = async () => {
  try {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) return console.error('❌ No user found in localStorage')

    const userData = JSON.parse(storedUser)
    const studentId = userData._id || userData.id

    const { data } = await api.get(`/notification/get-notification?studentId=${studentId}`)
    if (data.success) {
      notifications.value = data.data
    } else {
      console.warn('⚠️ Failed to fetch notifications:', data.message)
    }
  } catch (error) {
    console.error('❌ Error fetching notifications:', error)
  }
}

// --- Utility: format date nicely ---
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMinutes = Math.floor(diffMs / 60000)
  if (diffMinutes < 1) return 'just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

// --- Group by Today / Yesterday / Earlier ---
const groupedNotifications = computed(() => {
  const today = dayjs().startOf('day')
  const yesterday = dayjs().subtract(1, 'day').startOf('day')
  const groups = { today: [], yesterday: [], earlier: [] }

  notifications.value.forEach(n => {
    const created = dayjs(n.createdAt)
    if (created.isAfter(today)) groups.today.push(n)
    else if (created.isAfter(yesterday)) groups.yesterday.push(n)
    else groups.earlier.push(n)
  })

  for (const key in groups) {
    groups[key].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
  return groups
})

// --- UI Toggles ---
const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
  showNotifications.value = false
}

const toggleNotifications = async () => {
  showNotifications.value = !showNotifications.value
  showProfileMenu.value = false
  if (showNotifications.value) await fetchNotifications()
}

const logout = () => {
  router.push('/auth/login')
}

const confirmSignOut = () => {
  showSignOutModal.value = false
  logout()
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showProfileMenu.value = false
    showNotifications.value = false
  }
}

// --- Page Info Handling ---
const isDashboard = computed(() => route.path.includes('/dashboard'))

const currentPageTitle = ref('Dashboard')
const currentPageDescription = ref('Welcome to your student dashboard')

const updatePageInfo = () => {
  const path = route.path
  if (path.includes('/dashboard')) {
    currentPageTitle.value = `Welcome back, ${user.value.firstName}!`
    currentPageDescription.value = 'Manage your professor inquiries and track availability'
  } else if (path.includes('/locate-professor')) {
    currentPageTitle.value = 'Locate Professor'
    currentPageDescription.value = 'Find and connect with professors'
  } else if (path.includes('/messages')) {
    currentPageTitle.value = 'Inquiries'
    currentPageDescription.value = 'Communicate with professors and manage your inquiries'
  } else if (path.includes('/notifications')) {
    currentPageTitle.value = 'Notifications'
    currentPageDescription.value = 'View all your notifications'
  } else if (path.includes('/profile')) {
    currentPageTitle.value = 'Profile'
    currentPageDescription.value = 'Manage your account information'
  }
}

// --- Initials for Avatar ---
const initials = computed(() => {
  const first = user.value.firstName?.charAt(0).toUpperCase() || ''
  const last = user.value.lastName?.charAt(0).toUpperCase() || ''
  return first + last
})

// --- Watch for Route Change ---
watch(() => route.path, updatePageInfo)

// --- Lifecycle ---
onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  const storedUser = localStorage.getItem('user')
  if (storedUser) user.value = JSON.parse(storedUser)
  updatePageInfo()
  await fetchNotifications()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
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
