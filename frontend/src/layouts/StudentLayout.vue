<template>
  <div class="min-h-screen bg-white">
    <!-- Main Content Area -->
    <div class="flex">
      <!-- Sidebar - Desktop/Tablet Only -->
      <aside class="hidden md:block w-64 fixed left-4 top-4 bottom-4 h-auto shadow rounded-xl">
        <StudentSidebar />
      </aside>

      <!-- Main Content with Sidebar Spacing -->
      <main class="flex-1 md:ml-64">
        <router-view></router-view>
      </main>
    </div>
    <!-- Bottom Navigation - Mobile Only -->
    <StudentBottomNav />
    
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StudentSidebar from '@/views/student/StudentSidebar.vue'
import StudentBottomNav from '@/views/student/StudentBottomNav.vue'

const route = useRoute()


const router = useRouter()
const showConfirm = ref(false)

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
