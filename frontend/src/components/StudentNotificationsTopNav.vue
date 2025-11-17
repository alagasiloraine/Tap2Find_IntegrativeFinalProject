<template>
  <div class="-mx-4 md:-mx-6 px-4 md:px-6 py-1.5 flex flex-row justify-between items-center rounded-lg mx-0 mt-6 gap-3">
    <div class="flex-1">
      <h1 class="text-xs sm:text-xl md:text-3xl lg:text-4xl font-semibold text-gray-900">Notification</h1>
      <p class="text-[10px] sm:text-sm md:text-base text-gray-500">
        You have <span class="text-[#F5C400]">{{ unreadCount }} notification{{ unreadCount !== 1 ? 's' : '' }}</span> today.
      </p>
    </div>

    <!-- Filter Toolbar -->
    <div class="relative" ref="menuRef">
      <button class="p-2 rounded-full hover:bg-gray-100" aria-label="Filter" @click="toggleMenu">
        <iconify-icon icon="mage:filter" class="text-xl sm:text-2xl" />
      </button>
      <transition name="fade">
        <div v-if="menuOpen" class="absolute right-0 mt-2 w-[70vw] max-w-[176px] rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden z-10">
          <button @click="selectFilter(null)" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">All</button>
          <button @click="selectFilter('today')" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Today</button>
          <button @click="selectFilter('week')" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">This Week</button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'

const { notifications } = useNotifications()
const route = useRoute()
const router = useRouter()

const menuOpen = ref(false)
const menuRef = ref(null)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const selectFilter = (val) => {
  const next = { ...route.query }
  if (val === null) {
    delete next.filter
  } else {
    next.filter = val
  }
  router.replace({ query: next })
  menuOpen.value = false
}

const onClickOutside = (e) => {
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

const isToday = (date) => {
  const d = new Date(date)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

const unreadCount = computed(() => {
  const list = notifications.value || []
  return list.filter(n => !n.read && n.createdAt && isToday(n.createdAt)).length
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
