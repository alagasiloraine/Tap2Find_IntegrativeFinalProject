<template>
  <!-- Sidebar - Desktop -->
  <div class="hidden md:flex md:w-64 md:flex-col">
    <div class="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
      <!-- Logo -->
      <div class="flex items-center flex-shrink-0 px-4">
        <router-link to="/professor" class="text-xl font-bold text-gray-800">
          Tap2Find Professor 🔥
        </router-link>
      </div>

      <!-- Navigation -->
      <div class="mt-5 flex-grow flex flex-col">
        <nav class="flex-1 px-2 pb-4 space-y-1">
          <!-- Professor Dashboard -->
          <router-link
            to="/professor"
            class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
            :class="$route.path === '/professor' ? 'bg-blue-100 text-blue-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
          >
            <span class="mr-3 text-lg">📊</span>
            Professor Dashboard
          </router-link>

          <!-- Set Availability Status -->
          <router-link
            to="/professor/availability"
            class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <span class="mr-3 text-lg">✅</span>
            Set Availability Status
          </router-link>

          <!-- Manage Student Concerns -->
          <router-link
            to="/professor/concerns"
            class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <span class="mr-3 text-lg">📬</span>
            Manage Student Concerns
          </router-link>

          <!-- Upload New/Edit Teaching Schedule -->
          <router-link
            to="/professor/schedule"
            class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <span class="mr-3 text-lg">📅</span>
            Upload New/Edit Teaching Schedule
          </router-link>

          <!-- Profile Page -->
          <router-link
            to="/professor/profile"
            class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <span class="mr-3 text-lg">👤</span>
            Profile Page
          </router-link>
        </nav>
      </div>

      <!-- User Profile -->
      <div class="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">{{ initials }}</span>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-700">Prof. {{ user.firstName }} {{ user.lastName }}</p>
            <p class="text-xs text-gray-500">{{ user.emailAddress }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const user = ref({
  _id: '',
  firstName: '',
  lastName: '',
  role: '',
  emailAddress: '',
  status: ''
})

const initials = computed(() => {
  const first = user.value.firstName?.charAt(0).toUpperCase() || ''
  const last = user.value.lastName?.charAt(0).toUpperCase() || ''
  return first + last
})

onMounted(async () => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
})
</script>
