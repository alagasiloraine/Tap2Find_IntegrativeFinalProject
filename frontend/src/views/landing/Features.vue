<template>
  <div class="bg-white min-h-screen">
    <TopNavbar />
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Features</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">Explore what Tap2Find offers to streamline connections between students and professors.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center p-8 border border-gray-200 rounded-lg">
          <div class="text-5xl mb-4">🔍</div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Locate Professors</h3>
          <p class="text-gray-600">Search and filter professors by name, department, or availability.</p>
        </div>
        <div class="text-center p-8 border border-gray-200 rounded-lg">
          <div class="text-5xl mb-4">⏱️</div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Real-time Availability</h3>
          <p class="text-gray-600">See who is available, busy, or offline in real time.</p>
        </div>
        <div class="text-center p-8 border border-gray-200 rounded-lg">
          <div class="text-5xl mb-4">💬</div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Messaging</h3>
          <p class="text-gray-600">Reach out quickly with concise, organized communication tools.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import TopNavbar from './TopNavbar.vue'
</script>
