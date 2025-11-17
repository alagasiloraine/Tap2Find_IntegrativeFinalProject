<template>
  <div class="min-h-screen flex bg-white">
    <!-- Sidebar -->
    <div class="hidden md:flex md:w-64 md:flex-col">
      <div class="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
        <!-- Logo -->
        <div class="flex items-center flex-shrink-0 px-4">
          <router-link to="/admin" class="text-xl font-bold text-gray-800">
            Tap2Find Admin 🔥
          </router-link>
        </div>
        
        <!-- Navigation -->
        <div class="mt-5 flex-grow flex flex-col">
          <nav class="flex-1 px-2 pb-4 space-y-1">
            <!-- Dashboard -->
            <router-link
              to="/admin"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
              :class="$route.path === '/admin' ? 'bg-blue-100 text-blue-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <span class="mr-3 text-lg">📊</span>
              Dashboard
            </router-link>
            
            <!-- Users -->
            <router-link
              to="/admin/users"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
              :class="$route.path.startsWith('/admin/users') ? 'bg-blue-100 text-blue-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <span class="mr-3 text-lg">👥</span>
              Manage Users
            </router-link>
            
            <!-- Professor Management -->
            <router-link
              to="/admin/professors"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
              :class="$route.path.startsWith('/admin/professors') ? 'bg-blue-100 text-blue-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <span class="mr-3 text-lg">📈</span>
              Professor Management
            </router-link>
            
            <!-- Manage Student Concerns -->
            <router-link
              to="/admin/concerns"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
              :class="$route.path.startsWith('/admin/concerns') ? 'bg-blue-100 text-blue-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <span class="mr-3 text-lg">📝</span>
              Manage Student Concerns
            </router-link>

            <!-- Generate Reports -->
            <router-link
              to="/admin/reports"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
              :class="$route.path.startsWith('/admin/reports') ? 'bg-blue-100 text-blue-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <span class="mr-3 text-lg">📄</span>
              Generate Reports
            </router-link>
          </nav>
        </div>
        
        <!-- User Profile -->
        <div class="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-medium">A</span>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-700">Admin User</p>
              <p class="text-xs text-gray-500">admin@tap2find.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col w-0 flex-1 overflow-hidden">
      <!-- Top Navigation -->
      <div class="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
        <!-- Mobile menu button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
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
            
            <!-- Profile dropdown -->
            <div class="ml-3 relative">
              <div class="flex items-center space-x-3">
                <div class="text-sm text-gray-700">
                  Welcome back, <span class="font-medium">Admin</span>
                </div>
                <router-link
                  to="/"
                  class="text-sm text-blue-600 hover:text-blue-500"
                >
                  View Site
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                <span class="text-xl font-bold text-gray-800">Tap2Find Admin 🔥</span>
              </div>
              <nav class="mt-5 px-2 space-y-1">
                <router-link
                  to="/admin"
                  class="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <span class="mr-4 text-lg">📊</span>
                  Dashboard
                </router-link>
                <a href="#" class="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                  <span class="mr-4 text-lg">👥</span>
                  Users
                </a>
                <a href="#" class="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                  <span class="mr-4 text-lg">📈</span>
                  Analytics
                </a>
                <a href="#" class="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                  <span class="mr-4 text-lg">⚙️</span>
                  Settings
                </a>
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

const route = useRoute()
const mobileMenuOpen = ref(false)

const pageTitle = computed(() => {
  switch (route.path) {
    case '/admin':
      return 'Dashboard'
    default:
      return 'Admin Panel'
  }
})
</script>