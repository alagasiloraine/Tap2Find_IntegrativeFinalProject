<template>
  <section class="w-full p-6">
    <div class="max-w-xl mx-auto text-center min-h-[calc(100vh-220px)] flex flex-col items-center justify-start pt-2">
      <div class="w-full flex flex-col items-center justify-start">
        <!-- Avatar with concentric rings -->
        <div class="relative mb-10">
          <div class="relative w-48 h-48 rounded-full bg-white flex items-center justify-center">
            <!-- rings -->
            <span class="absolute inset-0 rounded-full ring-4 pulse-ring pulse-1" :class="ringOuterClass"></span>
            <span class="absolute -inset-2 rounded-full ring-4 pulse-ring pulse-2" :class="ringMiddleClass"></span>
            <span class="absolute -inset-4 rounded-full ring-4 pulse-ring pulse-3" :class="ringInnerClass"></span>
            <!-- avatar circle -->
            <div class="w-44 h-44 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              <img src="/sample.jpg" alt="Profile" class="w-full h-full object-contain" />
            </div>
          </div>
        </div>

        <!-- Greeting -->
        <div class="text-xl md:text-2xl font-semibold text-gray-900 mb-16">
          Good day, Prof Alvarez! You’re <span :class="statusColorClass">{{ statusText }}</span>.
        </div>

        <!-- Question -->
        <div class="text-sm md:text-base text-gray-600 mb-3">Want to change you status?</div>

        <!-- Status tiles -->
        <div class="flex gap-3 mt-1">
          <!-- Available -->
          <button
            @click="set('available')"
            class="w-32 h-24 rounded-2xl flex flex-col items-center justify-center border-2 tile-3d transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            :class="tileClass('available')"
          >
            <div class="w-10 h-10 rounded-full flex items-center justify-center badge-emboss" :class="iconBadgeClass('available')">
              <img src="/available.svg" alt="Available"/>
            </div>
            <div class="mt-2 text-sm font-medium" :class="labelColorClass('available')">Available</div>
          </button>

          <!-- Busy -->
          <button
            @click="set('busy')"
            class="w-32 h-24 rounded-2xl flex flex-col items-center justify-center border-2 tile-3d transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            :class="tileClass('busy')"
          >
            <div class="w-10 h-10 rounded-full flex items-center justify-center badge-emboss" :class="iconBadgeClass('busy')">
              <img src="/busy.svg" alt="Busy"/>
            </div>
            <div class="mt-2 text-sm font-medium" :class="labelColorClass('busy')">Busy</div>
          </button>

          <!-- Not Available -->
          <button
            @click="set('not_available')"
            class="w-32 h-24 rounded-2xl flex flex-col items-center justify-center border-2 tile-3d transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            :class="tileClass('not_available')"
          >
            <div class="w-10 h-10 rounded-full flex items-center justify-center badge-emboss" :class="iconBadgeClass('not_available')">
              <img src="/notavailable.svg" alt="Not Available"/>
            </div>
            <div class="mt-2 text-sm font-medium" :class="labelColorClass('not_available')">Not Available</div>
          </button>
        </div>
      </div>

      <!-- Footer info row pinned to bottom area -->
      <div class="w-full flex items-center justify-between text-[11px] text-gray-400 mt-auto pt-6">
        <div>Last Update : {{ lastUpdate }}</div>
        <div>Source: RFID</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const status = ref('available')
const set = (val) => {
  status.value = val
  lastUpdate.value = formatDateTime(new Date())
}

const statusLabel = computed(() => {
  return status.value === 'available' ? 'AVAILABLE' : status.value === 'busy' ? 'BUSY' : 'NOT AVAILABLE'
})

const statusColorClass = computed(() => {
  if (status.value === 'available') return 'text-green-600'
  if (status.value === 'busy') return 'text-yellow-400'
  return 'text-red-500'
})

// Greeting text (Title Case)
const statusText = computed(() => {
  return status.value === 'available' ? 'Available' : status.value === 'busy' ? 'Busy' : 'Not Available'
})

// UI helpers for tiles (white background; active border = status color, inactive = gray-50)
const tileClass = (t) => {
  const base = 'bg-white'
  const inactive = 'border-gray-50'
  if (status.value === t) {
    if (t === 'available') return `${base} border-green-500`
    if (t === 'busy') return `${base} border-amber-400`
    return `${base} border-red-400`
  }
  return `${base} ${inactive}`
}

const iconBadgeClass = (t) => {
  return 'bg-gray-100'
}

const iconColorClass = (t) => {
  const size = 'text-xl'
  if (status.value === t) return `text-white ${size}`
  if (t === 'available') return `text-green-600 ${size}`
  if (t === 'busy') return `text-yellow-500 ${size}`
  return `text-gray-500 ${size}`
}

const labelColorClass = (t) => {
  return 'text-gray-900'
}

const formatDateTime = (d) => {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yy = String(d.getFullYear()).slice(-2)
  let hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12
  const hh = String(hours).padStart(1, '0')
  return `${mm}/${dd}/${yy} | ${hh}:${minutes} ${ampm}`
}
const lastUpdate = ref(formatDateTime(new Date()))

// Ring color classes based on status
const ringOuterClass = computed(() => {
  if (status.value === 'available') return 'ring-green-200'
  if (status.value === 'busy') return 'ring-yellow-200'
  return 'ring-red-300'
})
const ringMiddleClass = computed(() => {
  if (status.value === 'available') return 'ring-green-100'
  if (status.value === 'busy') return 'ring-yellow-100'
  return 'ring-red-200'
})
const ringInnerClass = computed(() => {
  if (status.value === 'available') return 'ring-green-50'
  if (status.value === 'busy') return 'ring-yellow-50'
  return 'ring-red-100'
})
</script>

<style scoped>
@keyframes pulse-ring {
  0% { transform: scale(0.95); opacity: 0.6; }
  50% { transform: scale(1.05); opacity: 0.25; }
  100% { transform: scale(1); opacity: 0.1; }
}

.pulse-ring {
  animation: pulse-ring 2.4s ease-out infinite;
  will-change: transform, opacity;
}

.pulse-1 { animation-delay: 0s; }
.pulse-2 { animation-delay: 0.3s; }
.pulse-3 { animation-delay: 0.6s; }

/* 3D tile styling */
.tile-3d {
  background-image: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 8px 16px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.7) inset;
}
.tile-3d:hover {
  box-shadow: 0 12px 22px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.7) inset;
}
.tile-3d:active {
  box-shadow: 0 4px 10px rgba(0,0,0,0.08), 0 2px 0 rgba(0,0,0,0.06) inset;
}

/* Embossed circular badge behind the SVG */
.badge-emboss {
  box-shadow: inset 0 2px 6px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.9);
}
</style>
