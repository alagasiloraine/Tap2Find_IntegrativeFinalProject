<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Simple Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <router-link to="/" class="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
              Tap2Find 🔥
            </router-link>
          </div>
          
          <!-- Back to Home -->
          <div>
            <router-link 
              to="/" 
              class="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Home
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full">
        <router-view></router-view>
      </div>
    </main>

    <!-- Simple Footer -->
    <footer class="bg-white border-t border-gray-200">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div class="text-center text-sm text-gray-500">
          <strong>Tap2Find</strong> - {{ new Date().getFullYear() }} — Made with ❤️
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// No additional logic needed for auth layout
</script>
