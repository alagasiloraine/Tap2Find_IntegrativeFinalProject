<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- Main Content - Full Screen -->
    <main class="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
// No additional logic needed for auth layout
</script>
