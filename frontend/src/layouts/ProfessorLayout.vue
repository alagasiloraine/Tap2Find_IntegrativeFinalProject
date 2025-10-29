<template>
  <div class="min-h-screen flex bg-white">
    <!-- Sidebar -->
    <ProfessorSidebar />

    <!-- Main Content -->
    <div class="flex flex-col w-0 flex-1 overflow-hidden">
      <!-- Top Navigation -->
      <ProfessorTopNav @toggle-menu="mobileMenuOpen = !mobileMenuOpen" />

      <!-- Mobile sidebar -->
      <div v-if="mobileMenuOpen" class="md:hidden">
        <div class="fixed inset-0 flex z-40">
          <div class="fixed inset-0 bg-gray-600 bg-opacity-75" @click="mobileMenuOpen = false"></div>
          <div class="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div class="absolute top-0 right-0 -mr-12 pt-2">
              <button
                @click="mobileMenuOpen = false"
                class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span class="sr-only">Close sidebar</span>
                <span class="text-white text-xl">×</span>
              </button>
            </div>
            <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div class="flex-shrink-0 flex items-center px-4">
                <span class="text-xl font-bold text-gray-800">Tap2Find Professor 🔥</span>
              </div>
              <nav class="mt-5 px-2 space-y-1">
                <router-link to="/professor" class="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                  <span class="mr-4 text-lg">📊</span>
                  Professor Dashboard
                </router-link>
                <router-link to="/professor/availability" class="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                  <span class="mr-4 text-lg">✅</span>
                  Set Availability Status
                </router-link>
                <router-link to="/professor/concerns" class="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                  <span class="mr-4 text-lg">📬</span>
                  Manage Student Concerns
                </router-link>
                <router-link to="/professor/schedule" class="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                  <span class="mr-4 text-lg">📅</span>
                  Upload New/Edit Teaching Schedule
                </router-link>
                <router-link to="/professor/profile" class="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                  <span class="mr-4 text-lg">👤</span>
                  Profile Page
                </router-link>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <!-- Page Content -->
      <main class="flex-1 relative overflow-y-auto focus:outline-none">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <router-view></router-view>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import ProfessorSidebar from '@/components/ProfessorSidebar.vue'
import ProfessorTopNav from '@/components/ProfessorTopNav.vue'

const route = useRoute()
const mobileMenuOpen = ref(false)

const pageTitle = computed(() => {
  switch (route.path) {
    case '/professor':
      return 'Dashboard'
    default:
      return 'Professor Panel'
  }
})
</script>
