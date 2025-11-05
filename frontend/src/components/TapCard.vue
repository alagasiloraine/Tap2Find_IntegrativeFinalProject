<template>
  <div :class="wrapperClasses">
    <div v-if="$slots.icon || icon" class="shrink-0">
      <slot name="icon">
        <iconify-icon v-if="icon" :icon="icon" class="text-2xl" />
      </slot>
    </div>
    <div class="min-w-0 flex-1">
      <div v-if="title || $slots.title" class="text-sm font-medium text-gray-700">
        <slot name="title">{{ title }}</slot>
      </div>
      <div class="text-2xl font-bold text-gray-900 leading-tight">
        <slot>
          {{ value }}
        </slot>
      </div>
      <div v-if="subtitle || $slots.subtitle" class="text-xs text-gray-500">
        <slot name="subtitle">{{ subtitle }}</slot>
      </div>
    </div>
    <div v-if="$slots.action" class="ml-auto">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  value: { type: [String, Number], default: '' },
  icon: { type: String, default: '' },
  variant: { type: String, default: 'default' }, // default | primary | success | warning
  padded: { type: Boolean, default: true },
})

const variantClasses = {
  default: 'bg-white border border-gray-200',
  primary: 'bg-blue-50 border border-blue-200 text-blue-800',
  success: 'bg-green-50 border border-green-200 text-green-800',
  warning: 'bg-amber-50 border border-amber-200 text-amber-800',
}

const wrapperClasses = computed(() => {
  const base = 'rounded-2xl shadow-sm flex items-center gap-3'
  const pad = props.padded ? ' p-4' : ' p-2'
  const variant = variantClasses[props.variant] || variantClasses.default
  return `${base} ${variant}${pad}`
})
</script>
