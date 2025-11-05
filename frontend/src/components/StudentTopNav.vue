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
          v-if="notificationCount > 0"
          class="absolute -top-1 -right-1 h-5 w-5 bg-[#F5C400] text-white text-xs rounded-full flex items-center justify-center"
        >
          {{ notificationCount }}
        </span>
      </button>

      <!-- Notifications Dropdown -->
      <Transition name="dropdown">
        <div
          v-if="showNotifications"
          class="absolute right-0 mt-2 w-[420px] bg-white rounded-lg shadow-lg border border-gray-200 z-50"
        >
        <!-- Header -->
        <div class="px-6 py-4 flex justify-between items-center">
          <h3 class="text-xl font-bold text-gray-900">Notification</h3>
        </div>
        
        <!-- Notifications List (matches Notifications.vue content) -->
        <div class="max-h-96 overflow-y-auto px-6 py-2">
          <!-- Today -->
          <section class="mb-4">
            <h2 class="text-sm font-semibold text-gray-800">Today</h2>
            <ul class="mt-1">
              <li class="flex items-start gap-3 py-3">
                <img src="/profile.svg" alt="avatar" class="w-10 h-10 rounded-full object-cover" />
                <div class="flex-1">
                  <p class="text-gray-900">Professor Alvarez is <span class="font-semibold">Available.</span></p>
                  <p class="text-xs text-gray-500">30mins</p>
                </div>
              </li>
              <hr class="border-gray-200" />
              <li class="flex items-start gap-3 py-3">
                <img src="/profile.svg" alt="avatar" class="w-10 h-10 rounded-full object-cover" />
                <div class="flex-1">
                  <p class="text-gray-900">You successfully edit your profile picture.</p>
                  <p class="text-xs text-gray-500">1hr ago</p>
                </div>
              </li>
              <hr class="border-gray-200" />
              <li class="flex items-start gap-3 py-3">
                <img src="/profile.svg" alt="avatar" class="w-10 h-10 rounded-full object-cover" />
                <div class="flex-1">
                  <p class="text-gray-900">You successfully sent a message to Prof. Lopez.</p>
                  <p class="text-xs text-gray-500">1hr ago</p>
                </div>
              </li>
              <hr class="border-gray-200" />
              <li class="flex items-start gap-3 py-3">
                <img src="/profile.svg" alt="avatar" class="w-10 h-10 rounded-full object-cover" />
                <div class="flex-1">
                  <p class="text-gray-900">Sir Elmer sent a message.</p>
                  <p class="text-xs text-gray-500">1hr ago</p>
                </div>
              </li>
            </ul>
          </section>

          <!-- Yesterday -->
          <section>
            <h2 class="text-sm font-semibold text-gray-800">Yesterday</h2>
            <ul class="mt-1">
              <li class="flex items-start gap-3 py-3">
                <img src="/profile.svg" alt="avatar" class="w-10 h-10 rounded-full object-cover" />
                <div class="flex-1">
                  <p class="text-gray-900">You successfully sent a message to Prof. Lopez.</p>
                  <p class="text-xs text-gray-500">1hr ago</p>
                </div>
              </li>
            </ul>
          </section>
        </div>
        <!-- Footer -->
        <div v-if="notifications.length >= 5" class="px-6 py-3 border-t border-gray-100 text-right bg-white rounded-b-lg">
          <router-link to="/student/notifications" class="text-sm text-[#102A71] hover:underline">View all</router-link>
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
          <span class="text-sm font-semibold text-blue-600">JD</span>
        </div>
        
        <!-- Profile Info -->
        <div class="flex flex-col items-start">
          <span class="text-sm font-semibold text-gray-900">John Doe</span>
          <span class="text-xs text-gray-500">john.doe@student.edu</span>
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
      </transition>
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

const router = useRouter()
const route = useRoute()

const showProfileMenu = ref(false)
const showNotifications = ref(false)
const notificationCount = ref(3)
const showSignOutModal = ref(false)

// Check if current page is Dashboard
const isDashboard = computed(() => {
  return route.path.includes('/dashboard')
})

// Page information based on current route
const currentPageTitle = ref('Dashboard')
const currentPageDescription = ref('Welcome to your student dashboard')

import { useNotifications } from '@/composables/useNotifications'
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
  console.log('Logging out...')
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

// Update page title and description based on current route
const updatePageInfo = () => {
  const path = route.path
  if (path.includes('/dashboard')) {
    currentPageTitle.value = 'Welcome back, John!'
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

// Watch for route changes
watch(() => route.path, updatePageInfo)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  updatePageInfo()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const getStatusIcon = (status) => {
  if (status === 'available') return 'lucide:check'
  if (status === 'message') return 'lucide:message-circle'
  if (status === 'busy') return 'lucide:x'
  return 'lucide:circle'
}
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
