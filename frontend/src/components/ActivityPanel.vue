<template>
  <div class="rounded-2xl border border-gray-200 bg-white overflow-hidden">
    <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
      <h3 class="font-semibold text-gray-900">{{ title }}</h3>
      <slot name="action" />
    </div>
    <ul v-if="items && items.length" class="divide-y divide-gray-100">
      <li v-for="(item, idx) in items" :key="idx" class="px-4 py-3 flex gap-3 items-start hover:bg-gray-50">
        <div class="w-8 h-8 rounded-full bg-gray-100 grid place-items-center text-gray-500 shrink-0">
          <slot name="icon" :item="item" :index="idx">
            <iconify-icon :icon="item.icon || 'mdi:clock-outline'" />
          </slot>
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-sm text-gray-900 truncate">
            <slot name="primary" :item="item" :index="idx">
              {{ item.primary }}
            </slot>
          </div>
          <div class="text-xs text-gray-500">
            <slot name="secondary" :item="item" :index="idx">
              {{ item.secondary }}
            </slot>
          </div>
        </div>
        <div class="text-xs text-gray-400 whitespace-nowrap">
          <slot name="time" :item="item" :index="idx">
            {{ item.time }}
          </slot>
        </div>
      </li>
    </ul>
    <div v-else class="px-4 py-10 text-center text-sm text-gray-500">
      <iconify-icon icon="mdi:inbox-outline" class="text-3xl text-gray-300 mb-2" />
      <div>No recent activity</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: 'Recent Activity' },
  items: { type: Array, default: () => [] },
})
</script>
