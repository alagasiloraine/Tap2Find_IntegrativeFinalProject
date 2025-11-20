<template>
  <transition
    enter-active-class="transition transform duration-200 ease-out"
    leave-active-class="transition transform duration-150 ease-in"
    enter-from-class="opacity-0 translate-y-2 translate-x-2"
    leave-to-class="opacity-0 translate-y-2 translate-x-2"
  >
    <div
      v-if="visible"
      :class="[
        'fixed bottom-4 right-4 z-[9999] max-w-xs bg-white/95 backdrop-blur-sm shadow-xl rounded-xl px-4 pt-3 pb-2 text-sm border',
        typeClass.border,
        typeClass.text
      ]"
    >
      <div class="flex items-start gap-3">
        <div
          :class="[
            'mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold',
            typeClass.avatarBg,
            typeClass.avatarBorder,
            typeClass.avatarText
          ]"
        >
          ✓
        </div>
        <div class="flex-1">
          <div
            :class="[
              'text-xs font-semibold uppercase tracking-wide',
              typeClass.heading
            ]"
          >
            {{ headingLabel }}
          </div>
          <div class="text-[13px] leading-snug mt-0.5">
            {{ message }}
          </div>
        </div>
      </div>
      <div
        class="mt-2 h-0.5 w-full rounded-full overflow-hidden"
        :class="typeClass.trackBg"
      >
        <div
          class="h-full transition-all duration-[3000ms]"
          :class="typeClass.barBg"
          :style="{ width: progress + '%' }"
        ></div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  message: { type: String, default: '' },
  progress: { type: Number, default: 0 },
  type: {
    type: String,
    default: 'success',
    validator: (v) => ['success', 'error', 'warning', 'info'].includes(v)
  }
})

const headingLabel = computed(() => {
  if (props.type === 'error') return 'Error'
  if (props.type === 'warning') return 'Warning'
  if (props.type === 'info') return 'Info'
  return 'Success'
})

const typeClass = computed(() => {
  switch (props.type) {
    case 'error':
      return {
        border: 'border-red-200',
        text: 'text-red-900',
        avatarBg: 'bg-red-50',
        avatarBorder: 'border-red-200',
        avatarText: 'text-red-600',
        heading: 'text-red-700',
        trackBg: 'bg-red-100',
        barBg: 'bg-red-500'
      }
    case 'warning':
      return {
        border: 'border-amber-200',
        text: 'text-amber-900',
        avatarBg: 'bg-amber-50',
        avatarBorder: 'border-amber-200',
        avatarText: 'text-amber-600',
        heading: 'text-amber-700',
        trackBg: 'bg-amber-100',
        barBg: 'bg-amber-500'
      }
    case 'info':
      return {
        border: 'border-sky-200',
        text: 'text-sky-900',
        avatarBg: 'bg-sky-50',
        avatarBorder: 'border-sky-200',
        avatarText: 'text-sky-600',
        heading: 'text-sky-700',
        trackBg: 'bg-sky-100',
        barBg: 'bg-sky-500'
      }
    case 'success':
    default:
      return {
        border: 'border-emerald-200',
        text: 'text-emerald-900',
        avatarBg: 'bg-emerald-50',
        avatarBorder: 'border-emerald-200',
        avatarText: 'text-emerald-600',
        heading: 'text-emerald-700',
        trackBg: 'bg-emerald-100',
        barBg: 'bg-emerald-500'
      }
  }
})
</script>