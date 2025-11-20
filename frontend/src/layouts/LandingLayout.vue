<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- Navbar -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <span class="text-xl font-bold text-gray-800">Tap2Find 🔥</span>
          </div>
          
          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-8">
            <router-link to="/" class="text-gray-600 hover:text-gray-900">Home</router-link>
            <a href="#features" class="text-gray-600 hover:text-gray-900">Features</a>
            <router-link to="/about" class="text-gray-600 hover:text-gray-900">About</router-link>
            <a href="#contact" class="text-gray-600 hover:text-gray-900">Contact</a>
            <router-link to="/auth/login" class="text-gray-600 hover:text-gray-900">Login</router-link>
            <router-link to="/auth/register" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Get Started</router-link>
          </div>
          
          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-gray-600 hover:text-gray-900">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile Navigation -->
      <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t border-gray-200">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link to="/" class="block px-3 py-2 text-gray-600 hover:text-gray-900" @click="mobileMenuOpen = false">Home</router-link>
          <a href="#features" class="block px-3 py-2 text-gray-600 hover:text-gray-900">Features</a>
          <router-link to="/about" class="block px-3 py-2 text-gray-600 hover:text-gray-900" @click="mobileMenuOpen = false">About</router-link>
          <a href="#contact" class="block px-3 py-2 text-gray-600 hover:text-gray-900">Contact</a>
          <router-link to="/auth/login" class="block px-3 py-2 text-gray-600 hover:text-gray-900" @click="mobileMenuOpen = false">Login</router-link>
          <router-link to="/auth/register" class="block px-3 py-2 bg-blue-600 text-white rounded-md" @click="mobileMenuOpen = false">Get Started</router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow">
      <router-view></router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <strong class="text-gray-800">Tap2Find</strong> - {{ new Date().getFullYear() }} — Made with ❤️
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const mobileMenuOpen = ref(false)
</script>

