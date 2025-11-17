<template>
  <div class="min-h-screen bg-white">
    <!-- Main Content Area -->
    <div class="flex">
      <!-- Sidebar - Desktop/Tablet Only -->
      <aside class="hidden md:block md:w-56 lg:w-64 xl:w-72 fixed md:left-3 lg:left-4 xl:left-6 md:top-3 md:bottom-3 lg:top-4 lg:bottom-4 h-auto shadow rounded-xl z-40">
        <StudentSidebar />
      </aside>

      <!-- Main Content with Sidebar Spacing -->
      <main class="flex-1 min-w-0 px-4 sm:px-6 md:px-6 pb-20 md:pb-0 md:ml-[14.75rem] lg:ml-[17rem] xl:ml-[19.5rem]">
        <div class="sticky top-0 z-30 bg-white">
          <StudentNotificationsTopNav v-if="isNotifications" />
          <StudentTopNav v-else />
        </div>
        <router-view></router-view>
      </main>
    </div>

    <!-- Mobile Bottom Navigation -->
    <nav class="md:hidden fixed left-0 right-0 z-40 px-4" style="bottom: calc(0.75rem + env(safe-area-inset-bottom, 0px)); padding-bottom: env(safe-area-inset-bottom, 0px);">
      <div class="mx-auto max-w-md">
        <div class="rounded-2xl bg-white border border-gray-200 shadow-lg">
          <ul class="flex items-center justify-between px-3 py-2">
            <!-- Home -->
            <router-link to="/student/dashboard" class="flex items-center">
              <div :class="isActive('/student/dashboard') ? 'bg-[#cbd5f1]/60 text-[#102A71]' : 'text-gray-500'" class="flex items-center gap-2 h-10 px-3 rounded-full transition-colors">
                <iconify-icon :icon="isActive('/student/dashboard') ? 'fluent:home-12-filled' : 'fluent:home-12-regular'" class="text-xl" />
                <span v-if="isActive('/student/dashboard')" class="text-sm font-medium">Home</span>
              </div>
            </router-link>

            <!-- Locate Professor -->
            <router-link to="/student/locate-professor" class="flex items-center">
              <div :class="isActive('/student/locate-professor') ? 'bg-[#cbd5f1]/60 text-[#102A71]' : 'text-gray-500'" class="flex items-center gap-2 h-10 px-3 rounded-full transition-colors">
                <iconify-icon :icon="isActive('/student/locate-professor') ? 'fluent:location-12-filled' : 'fluent:location-12-regular'" class="text-xl" />
                <span v-if="isActive('/student/locate-professor')" class="text-sm font-medium">Locate</span>
              </div>
            </router-link>

            <!-- Notifications -->
            <router-link to="/student/notifications" class="flex items-center">
              <div :class="isActive('/student/notifications') ? 'bg-[#cbd5f1]/60 text-[#102A71]' : 'text-gray-500'" class="flex items-center gap-2 h-10 px-3 rounded-full transition-colors">
                <iconify-icon icon="lucide:bell" class="text-xl" />
                <span v-if="isActive('/student/notifications')" class="text-sm font-medium">Alerts</span>
              </div>
            </router-link>

            <!-- Profile -->
            <router-link to="/student/profile" class="flex items-center">
              <div :class="isActive('/student/profile') ? 'bg-[#cbd5f1]/60 text-[#102A71]' : 'text-gray-500'" class="flex items-center gap-2 h-10 px-3 rounded-full transition-colors">
                <iconify-icon :icon="isActive('/student/profile') ? 'lucide:user' : 'lucide:user'" class="text-xl" />
                <span v-if="isActive('/student/profile')" class="text-sm font-medium">Profile</span>
              </div>
            </router-link>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StudentSidebar from '@/views/student/StudentSidebar.vue'
import StudentTopNav from '@/components/StudentTopNav.vue'
import StudentNotificationsTopNav from '@/components/StudentNotificationsTopNav.vue'

const route = useRoute()


const router = useRouter()
const showConfirm = ref(false)
const isNotifications = computed(() => route.path.includes('/student/notifications'))

// Helper to highlight active bottom nav item
const isActive = (path) => route.path === path

// 🧩 Reactive user state
const user = ref({
  firstName: '',
  lastName: '',
  role: '',
  emailAddress: ''
})

const mobileMenuOpen = ref(false)
const profileOpen = ref(false)

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    profileOpen.value = false
  }
}

const confirmLogout = () => {
  showConfirm.value = true
}

// Handle logout
const handleLogout = () => {
  // ✅ Clear session data
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('user')

  showConfirm.value = false

  // Redirect to login page
  router.push('/login')
}

const userInitials = computed(() => {
  const first = user.value.firstName?.charAt(0) || ''
  const last = user.value.lastName?.charAt(0) || ''
  return (first + last).toUpperCase()
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
   const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
