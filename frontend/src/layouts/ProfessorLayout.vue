<template>
  <div class="min-h-screen bg-white">
    <div class="flex">
      <aside class="hidden md:block w-64 fixed left-4 top-4 bottom-4 h-auto shadow rounded-xl">
        <ProfessorSidebar />
      </aside>

      <main class="flex-1 md:ml-64">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import ProfessorSidebar from '@/views/professor/ProfessorSidebar.vue'
</script>
