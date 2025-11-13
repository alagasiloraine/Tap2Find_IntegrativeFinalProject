<template>
  <section class="w-full p-6">
    <div class="max-w-md mx-auto text-center min-h-[calc(100vh-220px)] flex flex-col items-center justify-start">
      <div class="w-full">
        <div
          class="relative overflow-hidden rounded-2xl px-6 py-7 text-2xl font-bold tracking-wide text-white shadow-lg
                 bg-gradient-to-b from-emerald-500 to-green-600 ring-1 ring-white/10"
        >
          <div class="absolute inset-0 pointer-events-none">
            <div class="absolute -top-10 -left-10 w-36 h-36 rounded-full bg-white/10 blur-2xl"></div>
            <div class="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-white/10 blur-2xl"></div>
          </div>
          <div class="relative">AVAILABLE</div>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-3">
          <div class="bg-gray-500 text-white rounded-xl px-5 py-4 shadow-sm">
            <div class="text-base font-semibold">Last RFID Tap</div>
            <div class="text-xs opacity-90">3:18 PM – IN KIOSK-ITR-202</div>
          </div>
          <div class="bg-gray-400 text-white rounded-xl px-5 py-4 shadow-sm">
            <div class="text-base font-semibold">Manual Updates</div>
            <div class="text-xs opacity-90">3:45 PM – Busy ON (Web)</div>
          </div>
        </div>

        <div class="mt-8 text-left">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Notification History</h2>
          <ul class="space-y-2">
            <li class="rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 bg-white">
              <div class="font-medium">11/4/2025 – 10:30 PM</div>
              <div class="opacity-80">TAP IN through RFID Tap</div>
            </li>
            <li class="rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 bg-white">
              <div class="font-medium">11/4/2025 – 10:35 PM</div>
              <div class="opacity-80">Change Availability Status to Busy (NOT AVAILABLE)</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
  
</template>

<script setup>
</script>
