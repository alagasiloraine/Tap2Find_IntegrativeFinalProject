<template>
  <div class="bg-white min-h-screen pb-28 md:pb-16 p-6 md:p-10">
    <!-- Header -->
    <div class="flex items-start justify-between relative">
      <div>
        <h1 class="text-4xl font-semibold text-gray-900">Notification</h1>
        <p class="text-base text-gray-500">You have <span class="text-[#F5C400]">3 notifications</span> today.</p>
      </div>
      <div class="relative" ref="menuRef">
        <button class="p-2 rounded-full hover:bg-gray-100" aria-label="Filter" @click="toggleMenu">
          <iconify-icon icon="mage:filter" class="text-2xl" />
        </button>
        <transition name="fade">
          <div v-if="menuOpen" class="absolute right-0 mt-2 w-44 rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden z-10">
            <button @click="selectFilter('today')" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Today</button>
            <button @click="selectFilter('week')" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">This Week</button>
            <button @click="selectFilter('month')" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">This Month</button>
          </div>
        </transition>
      </div>
    </div>

    <div class="mt-2"></div>

    <!-- List -->
    <div class="mt-6 space-y-6">
      <!-- Today -->
      <section>
        <h2 class="text-lg font-semibold">Today</h2>
        <ul class="mt-1">
          <li class="flex items-start gap-3 py-3">
            <img src="/profile.svg" alt="avatar" class="w-10 h-10 rounded-full object-cover" />
            <div class="flex-1">
              <p class="text-gray-900">Professor Alvarez is <span class="font-semibold">Available.</span></p>
              <p class="text-xs text-gray-500">30mins</p>
            </div>
          </li>
          <hr class="border-gray-200" />
          <li class="flex items-start gap-3 py-3">
            <img src="/profile.svg" alt="avatar" class="w-10 h-10 rounded-full object-cover" />
            <div class="flex-1">
              <p class="text-gray-900">You successfully edit your profile picture.</p>
              <p class="text-xs text-gray-500">1hr ago</p>
            </div>
          </li>
          <hr class="border-gray-200" />
          <li class="flex items-start gap-3 py-3">
            <img src="/profile.svg" alt="avatar" class="w-10 h-10 rounded-full object-cover" />
            <div class="flex-1">
              <p class="text-gray-900">You successfully sent a message to Prof. Lopez.</p>
              <p class="text-xs text-gray-500">1hr ago</p>
            </div>
          </li>
          <hr class="border-gray-200" />
          <li class="flex items-start gap-3 py-3">
            <img src="/profile.svg" alt="avatar" class="w-10 h-10 rounded-full object-cover" />
            <div class="flex-1">
              <p class="text-gray-900">Sir Elmer sent a message.</p>
              <p class="text-xs text-gray-500">1hr ago</p>
            </div>
          </li>
        </ul>
      </section>

      <!-- Yesterday -->
      <section>
        <h2 class="text-lg font-semibold">Yesterday</h2>
        <ul class="mt-1">
          <li class="flex items-start gap-3 py-3">
            <img src="/profile.svg" alt="avatar" class="w-10 h-10 rounded-full object-cover" />
            <div class="flex-1">
              <p class="text-gray-900">You successfully sent a message to Prof. Lopez.</p>
              <p class="text-xs text-gray-500">1hr ago</p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const selected = ref('today')
const menuOpen = ref(false)
const menuRef = ref(null)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
function selectFilter(val) {
  selected.value = val
  menuOpen.value = false
}

function onClickOutside(e) {
  if (!menuRef.value) return
  if (!menuRef.value.contains(e.target)) {
    menuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
