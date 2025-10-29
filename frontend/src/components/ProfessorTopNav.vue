<template>
  <div class="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
    <!-- Mobile menu button -->
    <button
      @click="$emit('toggle-menu')"
      class="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
    >
      <span class="sr-only">Open sidebar</span>
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Page title -->
    <div class="flex-1 px-4 flex justify-between">
      <div class="flex-1 flex items-center">
        <h1 class="text-2xl font-semibold text-gray-900">
          {{ pageTitle }}
        </h1>
      </div>

      <!-- Right side actions -->
      <div class="ml-4 flex items-center md:ml-6">
        <!-- Notifications -->
        <button class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <span class="sr-only">View notifications</span>
          <span class="text-xl">🔔</span>
        </button>

        <!-- Profile quick links -->
        <div class="ml-3 relative">
          <div class="flex items-center space-x-3">
            <div class="text-sm text-gray-700">
              Welcome back, <span class="font-medium">Professor</span>
            </div>
            <router-link to="/" class="text-sm text-blue-600 hover:text-blue-500">
              View Site
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const pageTitle = computed(() => {
  switch (route.path) {
    case '/professor':
      return 'Dashboard'
    case '/professor/availability':
      return 'Set Availability Status'
    case '/professor/concerns':
      return 'Manage Student Concerns'
    case '/professor/schedule':
      return 'Teaching Schedule'
    case '/professor/profile':
      return 'Profile'
    default:
      return 'Professor Panel'
  }
})
</script>
