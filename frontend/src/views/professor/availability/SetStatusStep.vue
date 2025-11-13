<template>
  <section class="w-full p-6 space-y-4">
    <h2 class="text-lg font-semibold text-gray-900">Set Status</h2>
    <div class="grid gap-4 sm:grid-cols-3">
      <button
        class="px-4 py-3 rounded-xl border text-sm"
        :class="status === 'available' ? 'border-blue-700 text-blue-700 bg-blue-50' : 'border-gray-200 text-gray-700'"
        @click="status = 'available'"
      >
        Available
      </button>
      <button
        class="px-4 py-3 rounded-xl border text-sm"
        :class="status === 'busy' ? 'border-blue-700 text-blue-700 bg-blue-50' : 'border-gray-200 text-gray-700'"
        @click="status = 'busy'"
      >
        Busy
      </button>
      <button
        class="px-4 py-3 rounded-xl border text-sm"
        :class="status === 'out' ? 'border-blue-700 text-blue-700 bg-blue-50' : 'border-gray-200 text-gray-700'"
        @click="status = 'out'"
      >
        Out
      </button>
    </div>
    <div class="text-sm text-gray-500">Selected: <span class="font-medium text-gray-700">{{ statusLabel }}</span></div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const status = ref('available')
const statusLabel = computed(() => {
  return status.value === 'available' ? 'Available' : status.value === 'busy' ? 'Busy' : 'Out'
})
</script>
