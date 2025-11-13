<template>
  <div class="px-4 md:px-2 py-4 flex justify-between items-center rounded-lg mx-4 mt-6" :class="{ 'gap-32': isDashboard }">
    <div class="flex-1">
      <h1 class="text-4xl font-semibold text-gray-900">{{ currentPageTitle }}</h1>
      <p class="text-base text-gray-500">{{ currentPageDescription }}</p>
    </div>

    <div v-if="!hideActions" class="flex items-center space-x-1">
      <div class="relative">
        <button @click="toggleNotifications" class="flex items-center justify-center w-12 h-12 text-2xl text-gray-600 hover:text-gray-600 relative transition-colors">
          <iconify-icon :icon="showNotifications ? 'ion:notifications' : 'ion:notifications-outline'" class="h-5 w-5" />
          <span v-if="notificationCount > 0" class="absolute -top-1 -right-1 h-5 w-5 bg-[#F5C400] text-white text-xs rounded-full flex items-center justify-center">{{ notificationCount }}</span>
        </button>

        <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
          <div v-if="showNotifications" class="absolute right-0 mt-2 w-[420px] bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <!-- Header with filter -->
            <div class="px-4 py-3 flex items-start justify-between">
              <div>
                <h3 class="text-xl font-semibold text-gray-900">Notification</h3>
                <p class="text-sm text-gray-500">You have <span class="text-[#F5C400]">3 notifications</span> today.</p>
              </div>
              <div class="relative" ref="menuRef">
                <button class="p-2 rounded-full hover:bg-gray-100" aria-label="Filter" @click.stop="toggleMenu">
                  <iconify-icon icon="mage:filter" class="text-xl" />
                </button>
                <transition name="fade">
                  <div v-if="menuOpen" class="absolute right-0 mt-2 w-40 rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden z-10">
                    <button @click="selectFilter('today')" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Today</button>
                    <button @click="selectFilter('week')" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">This Week</button>
                    <button @click="selectFilter('month')" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">This Month</button>
                  </div>
                </transition>
              </div>
            </div>

            <!-- List -->
            <div class="px-4 pb-4 max-h-96 overflow-y-auto">
              <!-- Today -->
              <section class="mb-4">
                <h4 class="text-sm font-semibold text-gray-900">Today</h4>
                <ul class="mt-1">
                  <li class="flex items-start gap-3 py-3">
                    <img src="/available.svg" alt="available" class="w-10 h-10 rounded-full object-cover" />
                    <div class="flex-1">
                      <p class="text-gray-900 text-sm">RFID tap recorded. Status set to <span class="font-semibold text-green-600">Available</span>. Students can now see you and send inquiries.</p>
                      <p class="text-xs text-gray-500">10 mins ago</p>
                    </div>
                  </li>
                  <hr class="border-gray-200" />
                  <li class="flex items-start gap-3 py-3">
                    <img src="/profile.svg" alt="avatar" class="w-10 h-10 rounded-full object-cover" />
                    <div class="flex-1">
                      <p class="text-gray-900 text-sm">“Prof, can I ask about Chapter 3 methodology?” Tap to view the full thread and reply.</p>
                      <p class="text-xs text-gray-500">25 mins ago</p>
                    </div>
                  </li>
                  <hr class="border-gray-200" />
                  <li class="flex items-start gap-3 py-3">
                    <img src="/busy.svg" alt="busy" class="w-10 h-10 rounded-full object-cover" />
                    <div class="flex-1">
                      <p class="text-gray-900 text-sm">You switched to <span class="font-semibold text-yellow-600">Busy</span> at 11:30 AM. Students can still message you; they’ll be informed replies may be delayed. Add a Busy note if needed.</p>
                      <p class="text-xs text-gray-500">40 mins ago</p>
                    </div>
                  </li>
                </ul>
              </section>

              <!-- Yesterday -->
              <section>
                <h4 class="text-sm font-semibold text-gray-900">Yesterday</h4>
                <ul class="mt-1">
                  <li class="flex items-start gap-3 py-3">
                    <img src="/notavailable.svg" alt="not available" class="w-10 h-10 rounded-full object-cover" />
                    <div class="flex-1">
                      <p class="text-gray-900 text-sm">RFID tap recorded. Status set to <span class="font-semibold text-red-600">Not Available</span>. You won’t receive new inquiries until you tap IN again.</p>
                      <p class="text-xs text-gray-500">Yesterday • 9:05 PM</p>
                    </div>
                  </li>
                  <hr class="border-gray-200" />
                  <li class="flex items-start gap-3 py-3">
                    <img src="/profile.svg" alt="avatar" class="w-10 h-10 rounded-full object-cover" />
                    <div class="flex-1">
                      <p class="text-gray-900 text-sm">“Prof, can I ask about Chapter 3 methodology?” Tap to view the full thread and reply.</p>
                      <p class="text-xs text-gray-500">Yesterday • 8:40 PM</p>
                    </div>
                  </li>
                  <hr class="border-gray-200" />
                  <li class="flex items-start gap-3 py-3">
                    <img src="/notavailable.svg" alt="not available" class="w-10 h-10 rounded-full object-cover" />
                    <div class="flex-1">
                      <p class="text-gray-900 text-sm">You switched to <span class="font-semibold text-red-600">Not Available</span>. New inquiries will be paused until you tap IN.</p>
                      <p class="text-xs text-gray-500">Yesterday • 8:30 PM</p>
                    </div>
                  </li>
                </ul>
              </section>
            </div>

            <div class="px-4 py-3 border-t border-gray-100 text-right bg-white rounded-b-lg">
              <router-link to="/professor/notifications" class="text-sm text-[#102A71] hover:underline">View all</router-link>
            </div>
          </div>
        </transition>
      </div>

      <div class="relative">
        <button @click="toggleProfileMenu" class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center overflow-hidden">
            <span class="text-sm font-semibold text-blue-600">{{ initials }}</span>
          </div>
          <div class="flex flex-col items-start">
            <span class="text-sm font-semibold text-gray-900">Prof. {{ user.firstName }} {{ user.lastName }}</span>
            <span class="text-xs text-gray-500">{{ user.emailAddress }}</span>
          </div>
          <iconify-icon icon="lucide:chevron-down" class="h-4 w-4 text-gray-400" />
        </button>

        <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
          <div v-if="showProfileMenu" class="absolute right-0 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div class="py-1">
              <router-link to="/professor/profile" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" @click="showProfileMenu = false">
                <iconify-icon icon="lucide:user" class="mr-2 h-4 w-4" />
                View Profile
              </router-link>
              <div class="border-t border-gray-100"></div>
              <button @click="showSignOutModal = true" class="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors">
                <iconify-icon icon="lucide:log-out" class="mr-2 h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>

  <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
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

const props = defineProps({
  hideActions: { type: Boolean, default: false }
})

const router = useRouter()
const route = useRoute()

const showProfileMenu = ref(false)
const showNotifications = ref(false)
const notificationCount = ref(0)
const showSignOutModal = ref(false)

const user = ref({
  firstName: '',
  lastName: '',
  role: '',
  emailAddress: '',
  status: ''
})

const isDashboard = computed(() => route.path === '/professor')

const currentPageTitle = ref('Dashboard')
const currentPageDescription = ref('Welcome to your professor dashboard')

const { notifications, count } = useNotifications()
notificationCount.value = count.value

// Local state for dropdown filter menu (from notifications page)
const selected = ref('today')
const menuOpen = ref(false)
const menuRef = ref(null)
function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
function selectFilter(val) {
  selected.value = val
  menuOpen.value = false
}

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
  showNotifications.value = false
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showProfileMenu.value = false
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

const updatePageInfo = () => {
  const path = route.path
  if (path === '/professor') {
    currentPageTitle.value = `Welcome back, ${user.value.firstName || 'Professor'}!`
    currentPageDescription.value = 'Manage inquiries, availability, and schedule'
  } else if (path.includes('/availability')) {
    currentPageTitle.value = 'Set Availability Status'
    currentPageDescription.value = 'Update your current availability for students'
  } else if (path.includes('/concerns')) {
    currentPageTitle.value = 'Manage Student Concerns'
    currentPageDescription.value = 'Review and respond to student concerns and inquiries'
  } else if (path.includes('/schedule')) {
    currentPageTitle.value = 'Upload Teaching Schedule'
    currentPageDescription.value = 'Upload a new schedule or edit your existing one'
  } else if (path.includes('/profile')) {
    currentPageTitle.value = 'Profile'
    currentPageDescription.value = 'Manage your profile information and preferences'
  }
}

// Watch for route changes and update page info
watch(() => route.path, updatePageInfo)

// Watch for user data changes and update page info when user loads
watch(user, () => {
  updatePageInfo()
}, { deep: true })

const initials = computed(() => {
  const first = user.value.firstName?.charAt(0).toUpperCase() || ''
  const last = user.value.lastName?.charAt(0).toUpperCase() || ''
  return first + last
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // Load user from localStorage FIRST
  const storedUser = localStorage.getItem('user')
  console.log('Stored user:', storedUser) // Debug log
  if (storedUser) {
    user.value = JSON.parse(storedUser)
    console.log('User data loaded:', user.value) // Debug log
  }
  
  // THEN call updatePageInfo
  updatePageInfo()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
</style>
