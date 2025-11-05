<template>
  <nav class="w-full bg-white/80 backdrop-blur sticky top-0 z-40 border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
      <router-link to="/" class="flex items-center space-x-2">
        <img src="/t2fLogogogo.svg" alt="Tap2Find" class="h-8 w-auto" />
        <span class="text-xl font-semibold text-gray-800">Tap<span class="text-yellow-500">2</span>Find</span>
      </router-link>
      <div class="flex items-center gap-6 text-sm font-medium">
        <router-link to="/" class="text-gray-600 hover:text-gray-900">Home</router-link>
        <router-link to="/about" class="text-gray-600 hover:text-gray-900">About</router-link>
        <router-link to="/features" class="text-gray-600 hover:text-gray-900">Features</router-link>
        <router-link to="/contact" class="text-gray-600 hover:text-gray-900">Contact</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
</script>
