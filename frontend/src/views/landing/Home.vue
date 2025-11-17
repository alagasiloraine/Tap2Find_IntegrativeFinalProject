<template>
  <div class="bg-white min-h-screen">
    <section id="hero" class="relative overflow-hidden h-screen flex items-center justify-center bg-white">
    <div class="relative z-10 mx-auto max-w-screen-xl 2xl:max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div class="text-center space-y-8 max-w-3xl mx-auto">
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-800 leading-tight mt-16">
            Find Your <span class="text-[#102A71]">Professors</span>, Instantly.
          </h1>
          <p class="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Tap2Find is an RFID-powered system that lets students instantly locate professors, check their availability, and send inquiries in one tap—built for the College of Computer Studies.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <router-link to="/register" class="group relative inline-flex items-center justify-center rounded-full bg-[#001740] hover:bg-[#0a2a6a] text-white font-semibold px-8 py-4 text-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105">
              <span class="relative z-10">Get Started</span>
              <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </router-link>
            <a href="#problem-solution" class="inline-flex items-center justify-center rounded-full bg-gray-100 backdrop-blur-md hover:bg-gray-200 text-[#001740] font-semibold px-8 py-4 text-lg transition-all duration-300 shadow-lg ">Learn More</a>
          </div>
          <div class="grid grid-cols-3 gap-4 pt-8 max-w-xl mx-auto">
            <div class="text-center">
              <p class="text-2xl font-bold text-[#F5C400]">100%</p>
              <p class="text-base text-gray-600 mt-1">RFID Coverage</p>
            </div>
            <div class="text-center border-l border-r border-blue-200/50">
              <p class="text-2xl font-bold text-[#F5C400]">&lt;1s</p>
              <p class="text-base text-gray-600 mt-1">Response Time</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-[#F5C400]">Live</p>
              <p class="text-base text-gray-600 mt-1">Availability</p>
            </div>
          </div>
        </div>
      </div>

    </section>

    <section id="problem-solution" class="bg-gray-50 border-t border-gray-200 min-h-screen flex items-center">
      <div class="mx-auto max-w-screen-xl 2xl:max-w-screen-2xl px-6 py-16 sm:py-20 w-full">
        <div class="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <div class="flex items-center gap-3">
              <span class="h-9 w-2 rounded-full bg-[#F5C400]"></span>
              <h1 class="text-3xl sm:text-4xl font-extrabold text-[#001740]">Problem and Solution</h1>
            </div>
            <p class="mt-3 text-gray-600">Students often struggle to locate their professors due to busy schedules, multiple rooms, and unexpected availability changes.</p>
            <div class="mt-8 text-2xl font-extrabold text-gray-900">Tired of wandering around the campus trying to find your professor?</div>
            <p class="mt-3 text-gray-600 max-w-2xl">Tap2Find creates a real-time system that updates automatically whenever a professor taps their RFID card. Students can open the app and instantly see who’s in, who’s out, who’s busy, and where they are located.</p>
            <div class="mt-8 space-y-3">
              <div class="flex items-center gap-3 rounded-lg bg-[#F5C400] text-[#001740] px-4 py-3 shadow-sm">
                <span class="h-2 w-2 rounded-full bg-white"></span>
                <span class="font-semibold">Where their professor currently is</span>
              </div>
              <div class="flex items-center gap-3 rounded-lg bg-[#F5C400] text-[#001740] px-4 py-3 shadow-sm">
                <span class="h-2 w-2 rounded-full bg-white"></span>
                <span class="font-semibold">Whether they’re available or busy</span>
              </div>
              <div class="flex items-center gap-3 rounded-lg bg-[#F5C400] text-[#001740] px-4 py-3 shadow-sm">
                <span class="h-2 w-2 rounded-full bg-white"></span>
                <span class="font-semibold">Whether they’re out of the campus</span>
              </div>
              <div class="flex items-center gap-3 rounded-lg bg-[#F5C400] text-[#001740] px-4 py-3 shadow-sm">
                <span class="h-2 w-2 rounded-full bg-white"></span>
                <span class="font-semibold">The best way to reach them</span>
              </div>
            </div>
          </div>
          <div class="relative mx-auto grid place-items-center">
            <div class="absolute -z-10 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,23,64,0.08)_0%,rgba(0,23,64,0.04)_50%,rgba(0,23,64,0)_75%)]"></div>
            <dotlottie-player
              src="https://lottie.host/5658b456-028d-4527-b219-25bbb14ca5eb/GTGHn8FjAv.lottie"
              background="transparent"
              speed="1"
              style="width: 540px; height:540px;"
              loop
              autoplay>
            </dotlottie-player>
          </div>
        </div>
      </div>
    </section>

    <section id="how-it-works" class="border-t border-gray-200 bg-gray-50 min-h-screen flex items-center">
      <div class="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div class="mb-10 sm:mb-12 text-center">
          <h1 class="text-5xl font-bold text-gray-900">How it works</h1>
          <p class="mt-3 text-gray-600">Three simple steps to get started.</p>
        </div>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div class="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <div class="h-10 w-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <span class="text-sm font-bold">1</span>
            </div>
            <div class="text-xl font-semibold text-gray-900">Browse classes</div>
            <p class="mt-2 text-gray-600">Search and filter to find the right classes.</p>
          </div>
          <div class="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <div class="h-10 w-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <span class="text-sm font-bold">2</span>
            </div>
            <div class="text-xl font-semibold text-gray-900">Plan your week</div>
            <p class="mt-2 text-gray-600">Add classes to your schedule and avoid conflicts.</p>
          </div>
          <div class="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <div class="h-10 w-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <span class="text-sm font-bold">3</span>
            </div>
            <div class="text-xl font-semibold text-gray-900">Track and manage</div>
            <p class="mt-2 text-gray-600">Stay on top of today’s classes with reminders.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const id = 'dotlottie-player-script'
  if (!document.getElementById(id)) {
    const s = document.createElement('script')
    s.id = id
    s.src = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.js'
    s.type = 'module'
    document.head.appendChild(s)
  }
})
</script>

