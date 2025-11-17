<template>
  <div class="min-h-screen flex flex-col bg-white">
    <LandingNavbar />

    <!-- Main Content -->
    <main class="flex-grow min-h-screen">
      <router-view></router-view>
    </main>

    <LandingFooter />
  </div>
</template>

<script setup>
import LandingNavbar from '@/components/LandingNavbar.vue'
import LandingFooter from '@/components/LandingFooter.vue'
</script>

