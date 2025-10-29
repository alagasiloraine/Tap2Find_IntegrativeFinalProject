<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
    <div class="flex items-center justify-around px-2 py-1">
      <!-- Dashboard -->
      <router-link
        to="/student/dashboard"
        class="flex flex-col items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors"
        :class="[
          $route.path === '/student/dashboard'
            ? 'text-blue-600'
            : 'text-gray-600 hover:text-blue-600'
        ]"
      >
        <iconify-icon icon="lucide:layout-dashboard" class="h-6 w-6 mb-1" />
        <span>Dashboard</span>
      </router-link>

      <!-- Locate Professor -->
      <router-link
        to="/student/locate-professor"
        class="flex flex-col items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors"
        :class="[
          $route.path === '/student/locate-professor'
            ? 'text-blue-600'
            : 'text-gray-600 hover:text-blue-600'
        ]"
      >
        <iconify-icon icon="lucide:users" class="h-6 w-6 mb-1" />
        <span>Professors</span>
      </router-link>

      <!-- Notifications -->
      <router-link
        to="/student/notifications"
        class="flex flex-col items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors relative"
        :class="[
          $route.path === '/student/notifications'
            ? 'text-blue-600'
            : 'text-gray-600 hover:text-blue-600'
        ]"
      >
        <iconify-icon icon="lucide:bell" class="h-6 w-6 mb-1" />
        <span>Notifications</span>
        <span class="absolute top-1 right-3 h-2 w-2 bg-red-500 rounded-full"></span>
      </router-link>

      <!-- Profile -->
      <router-link
        to="/student/profile"
        class="flex flex-col items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors"
        :class="[
          $route.path === '/student/profile'
            ? 'text-blue-600'
            : 'text-gray-600 hover:text-blue-600'
        ]"
      >
        <iconify-icon icon="lucide:user" class="h-6 w-6 mb-1" />
        <span>Profile</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
// Pure navigation component
</script>
