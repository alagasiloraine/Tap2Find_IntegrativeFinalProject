<template>
  <section class="w-full p-6 space-y-4">
    <h2 class="text-lg font-semibold text-gray-900">Activity Panel</h2>
    <div class="rounded-xl border border-gray-200 overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 class="font-semibold text-gray-900">Recent Activity</h3>
      </div>
      <ul class="divide-y divide-gray-100">
        <li class="px-4 py-3 flex gap-3 items-start">
          <div class="w-8 h-8 rounded-full bg-gray-100 grid place-items-center text-gray-500 shrink-0">⏱️</div>
          <div class="min-w-0 flex-1">
            <div class="text-sm text-gray-900 truncate">Status changed</div>
            <div class="text-xs text-gray-500">from Busy to Available</div>
          </div>
          <div class="text-xs text-gray-400 whitespace-nowrap">2m ago</div>
        </li>
        <li class="px-4 py-3 flex gap-3 items-start">
          <div class="w-8 h-8 rounded-full bg-gray-100 grid place-items-center text-gray-500 shrink-0">💳</div>
          <div class="min-w-0 flex-1">
            <div class="text-sm text-gray-900 truncate">Card tapped</div>
            <div class="text-xs text-gray-500">Tap recognized successfully</div>
          </div>
          <div class="text-xs text-gray-400 whitespace-nowrap">5m ago</div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
</script>
