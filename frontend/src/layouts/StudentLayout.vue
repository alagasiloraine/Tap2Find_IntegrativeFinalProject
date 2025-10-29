<template>
  <div class="min-h-screen bg-white">
    <!-- Main Content Area -->
    <div class="flex">
      <!-- Sidebar - Desktop/Tablet Only -->
      <aside class="hidden md:block w-64 fixed left-4 top-4 bottom-4 h-auto shadow rounded-xl">
        <StudentSidebar />
      </aside>

      <!-- Main Content with Sidebar Spacing -->
      <main class="flex-1 md:ml-64">
        <router-view></router-view>
      </main>
    </div>

    <!-- Bottom Navigation - Mobile Only -->
    <StudentBottomNav />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import StudentSidebar from '@/views/student/StudentSidebar.vue'
import StudentBottomNav from '@/views/student/StudentBottomNav.vue'

const route = useRoute()
</script>
