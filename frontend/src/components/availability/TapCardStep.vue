<template>
  <section class="w-full p-6">
    <div
      class="max-w-md mx-auto text-center min-h-[calc(100vh-220px)] flex flex-col items-center justify-start pt-2"
    >
      <!-- Animation pinned closer to the very top -->
      <div class="flex justify-center mt-0 mb-4 -translate-y-4 md:-translate-y-6">
        <div
          class="w-52 h-52 md:w-64 md:h-64 rounded-full bg-gray-50 overflow-hidden flex items-center justify-center"
        >
          <dotlottie-player
            src="https://lottie.host/aac6b5be-196d-46ce-bc48-4f63d61721c7/XL5CWAG6Ai.lottie"
            autoplay
            loop
            style="width: 100%; height: 100%"
          />
        </div>
      </div>

      <!-- Text -->
      <h1 class="text-4xl font-semibold text-[#102A71] mb-24">Good day, Prof!</h1>
      <p class="text-2xl  font-semibold mb-1">Tap to start your day.</p>
      <p class="text-base text-gray-500">
        Please tap your RFID to set your status to <span class="font-medium" :class="statusColorClass">{{ displayStatus }}</span> so students can find you.
      </p>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import api from '@/utils/api.js'

const user = ref({
  id: '',
  firstName: '',
  lastName: '',
  role: '',
  emailAddress: '',
  status: 'available'
})

// Use computed properties instead of computed function
const statusColorClass = computed(() => {
  const status = user.value.status?.toLowerCase()
  if (status === 'available') return 'text-green-600'
  if (status === 'busy') return 'text-yellow-600' // Changed to yellow-600 for better visibility
  return 'text-red-600' // Changed to red-600 for better visibility
})

const displayStatus = computed(() => {
  const status = user.value.status?.toLowerCase()
  if (status === 'available') return 'Available'
  if (status === 'busy') return 'Busy'
  if (status === 'not available') return 'Not Available'
  return 'Not Available' // Default fallback
})

// const fetchCurrentUserStatus = async () => {
//   try {
//     const storedUser = localStorage.getItem('user')
//     if (!storedUser) {
//       console.error('No user found in localStorage')
//       return
//     }

//     const parsedUser = JSON.parse(storedUser)
    
//     // Initialize user data from localStorage first
//     user.value = { ...parsedUser }
    
//     // Then fetch the latest status from API
//     const response = await api.get(`/professors/${parsedUser.id}/status`)
    
//     if (response.data.success) {
//       // Update the user status with real-time data
//       user.value.status = response.data.data.status
      
//       // Also update localStorage with the latest status
//       const updatedUser = { ...parsedUser, status: response.data.data.status }
//       localStorage.setItem('user', JSON.stringify(updatedUser))
      
//       console.log('✅ Updated user status:', response.data.data.status)
//     }
//   } catch (error) {
//     console.error('Error fetching user status:', error)
//     // If API fails, use the status from localStorage
//     console.log('Using status from localStorage:', user.value.status)
//   }
// }

onMounted(() => {
  // Load initial user data from localStorage immediately
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
  
  // Load Lottie player
  if (!customElements.get('dotlottie-player')) {
    const s = document.createElement('script')
    s.src = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.js'
    s.type = 'module'
    document.head.appendChild(s)
  }
  
  // Fetch latest status
  fetchCurrentUserStatus()
})
</script>