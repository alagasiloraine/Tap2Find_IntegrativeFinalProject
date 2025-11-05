<template>
  <div class="min-h-screen bg-white">
    <div class="flex">
      <aside class="hidden md:block w-64 fixed left-4 top-4 bottom-4 h-auto shadow rounded-xl">
        <ProfessorSidebar />
      </aside>

      <main class="flex-1 md:ml-64">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ProfessorSidebar from '@/components/ProfessorSidebar.vue'
import ProfessorTopNav from '@/components/ProfessorTopNav.vue'

const route = useRoute()
const mobileMenuOpen = ref(false)

const user = ref({
  firstName: '',
  lastName: '',
  emailAddress: ''
})

const userInitials = computed(() => {
  const first = user.value.firstName?.charAt(0) || ''
  const last = user.value.lastName?.charAt(0) || ''
  return (first + last).toUpperCase()
})

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
})

const pageTitle = computed(() => {
  switch (route.path) {
    case '/professor':
      return 'Dashboard'
    default:
      return 'Professor Panel'
  }
})
</script>
