<template>
  <div :class="wrapperClasses">
    <div :class="iconWrapperClasses">
      <slot name="icon">
        <iconify-icon :icon="icon" class="text-xl" />
      </slot>
    </div>
    <div class="min-w-0">
      <div class="text-xs text-gray-500">{{ label }}</div>
      <div class="text-2xl font-bold leading-tight">{{ value }}</div>
    </div>
    <div v-if="trend" class="ml-auto flex items-center gap-1 text-xs" :class="trendClasses">
      <iconify-icon :icon="trendIcon" />
      <span>{{ trend }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String, default: 'mdi:information-outline' },
  color: { type: String, default: 'blue' }, // blue, green, amber, purple, red, gray
  trend: { type: String, default: '' },
  trendUp: { type: Boolean, default: true },
})

const colorMap = {
  blue:   { bg: 'bg-blue-50', text: 'text-blue-700', iconBg: 'bg-blue-100', iconText: 'text-blue-600' },
  green:  { bg: 'bg-green-50', text: 'text-green-700', iconBg: 'bg-green-100', iconText: 'text-green-600' },
  amber:  { bg: 'bg-amber-50', text: 'text-amber-700', iconBg: 'bg-amber-100', iconText: 'text-amber-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', iconBg: 'bg-purple-100', iconText: 'text-purple-600' },
  red:    { bg: 'bg-red-50', text: 'text-red-700', iconBg: 'bg-red-100', iconText: 'text-red-600' },
  gray:   { bg: 'bg-gray-50', text: 'text-gray-700', iconBg: 'bg-gray-100', iconText: 'text-gray-600' },
}

const c = computed(() => colorMap[props.color] || colorMap.blue)

const wrapperClasses = computed(() => `rounded-2xl shadow p-4 flex items-center gap-3 ${c.value.bg}`)
const iconWrapperClasses = computed(() => `w-10 h-10 rounded-xl grid place-items-center ${c.value.iconBg} ${c.value.iconText}`)
const trendClasses = computed(() => props.trendUp ? 'text-green-600' : 'text-red-600')
const trendIcon = computed(() => props.trendUp ? 'mdi:arrow-up' : 'mdi:arrow-down')
</script>
