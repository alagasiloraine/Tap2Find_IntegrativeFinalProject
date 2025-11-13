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
        Please tap your RFID to set your status to <span class="font-medium text-green-600">Available</span> so students can find you.
      </p>
    </div>
  </section>
</template>


<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  if (!customElements.get('dotlottie-player')) {
    const s = document.createElement('script')
    s.src = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.js'
    s.type = 'module'
    document.head.appendChild(s)
  }
})
</script>

