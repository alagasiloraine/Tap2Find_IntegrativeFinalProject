<template>
  <div class="px-4 md:px-2 py-4 flex justify-between items-center rounded-lg mx-4 mt-6" :class="{ 'gap-32': isDashboard }">
    <div class="flex-1">
      <h1 class="text-4xl font-semibold text-gray-900">{{ currentPageTitle }}</h1>
      <p class="text-base text-gray-500">{{ currentPageDescription }}</p>
    </div>

    <div class="flex items-center space-x-1">
      <div class="relative">
        <button @click="toggleNotifications" class="flex items-center justify-center w-12 h-12 text-2xl text-gray-600 hover:text-gray-600 relative transition-colors">
          <iconify-icon :icon="showNotifications ? 'ion:notifications' : 'ion:notifications-outline'" class="h-5 w-5" />
          <span v-if="notificationCount > 0" class="absolute -top-1 -right-1 h-5 w-5 bg-[#F5C400] text-white text-xs rounded-full flex items-center justify-center">{{ notificationCount }}</span>
        </button>

        <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
          <div v-if="showNotifications" class="absolute right-0 mt-2 w-[420px] bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div class="px-6 py-4 flex justify-between items-center">
              <h3 class="text-xl font-bold text-gray-900">Notification</h3>
            </div>
            <div :class="notifications.length > 5 ? 'max-h-96 overflow-y-auto' : 'max-h-none overflow-visible'">
              <div v-for="n in notifications" :key="n.id" class="px-6 py-4 bg-white last:border-b-0">
                <div class="flex items-center">
                  <div class="flex-shrink-0 mr-4">
                    <div class="w-12 h-12 bg-[#102A71] rounded-full flex items-center justify-center overflow-hidden">
                      <span class="text-white text-sm font-bold">PA</span>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-gray-900 text-sm">{{ n.title }}</p>
                    <p class="text-sm text-gray-600 mt-1">{{ n.message }}</p>
                  </div>
                  <div class="flex-shrink-0 ml-4">
                    <p class="text-xs text-gray-500">{{ n.time }}</p>
                  </div>
                </div>
              </div>
              <div v-if="notifications.length === 0" class="px-6 py-8 text-center text-gray-500">No notifications</div>
            </div>
            <div v-if="notifications.length >= 5" class="px-6 py-3 border-t border-gray-100 text-right bg-white rounded-b-lg">
              <router-link to="/professor/notifications" class="text-sm text-[#102A71] hover:underline">View all</router-link>
            </div>
          </div>
        </transition>
      </div>

      <div class="relative">
        <button @click="toggleProfileMenu" class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center overflow-hidden">
            <span class="text-sm font-semibold text-blue-600">PA</span>
          </div>
          <div class="flex flex-col items-start">
            <span class="text-sm font-semibold text-gray-900">Prof. Alvarez</span>
            <span class="text-xs text-gray-500">pauline.alvarez@univ.edu</span>
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

const router = useRouter()
const route = useRoute()

const showProfileMenu = ref(false)
const showNotifications = ref(false)
const notificationCount = ref(0)
const showSignOutModal = ref(false)

const isDashboard = computed(() => route.path === '/professor')

const currentPageTitle = ref('Dashboard')
const currentPageDescription = ref('Welcome to your professor dashboard')

const { notifications, count } = useNotifications()
notificationCount.value = count.value

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
    currentPageTitle.value = 'Welcome back, Professor!'
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

watch(() => route.path, updatePageInfo)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  updatePageInfo()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
</style>
