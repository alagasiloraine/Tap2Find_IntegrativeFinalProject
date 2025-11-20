<template>
  <section id="hero" class="relative overflow-hidden h-screen flex items-center justify-center bg-white">
    <!-- Background accents -->
    <div class="absolute inset-0 bg-white">
      <div
        class="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
      ></div>
      <div
        class="absolute bottom-20 right-10 w-72 h-72 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed"
      ></div>
      <div
        class="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(0,23,64,.06)_25%,rgba(0,23,64,.06)_26%,transparent_27%,transparent_74%,rgba(0,23,64,.06)_75%,rgba(0,23,64,.06)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(0,23,64,.06)_25%,rgba(0,23,64,.06)_26%,transparent_27%,transparent_74%,rgba(0,23,64,.06)_75%,rgba(0,23,64,.06)_76%,transparent_77%,transparent)] bg-[size:50px_50px]"
      ></div>
    </div>

    <!-- Hero content -->
    <div class="relative z-10 mx-auto max-w-screen-xl 2xl:max-w-screen-2xl px-4 sm:px-6 lg:px-8">
      <div class="text-center space-y-8 max-w-3xl mx-auto">
        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#001740] leading-tight mt-16">
          Find Your
          <span class="text-[#102A71]">Professors</span>,
          Instantly.
        </h1>
        <p class="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Tap2Find is an RFID-powered system that lets students instantly locate professors, check their availability,
          and send inquiries in one tap—built for the College of Computer Studies.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <router-link
            to="/auth/register"
            class="group relative inline-flex items-center justify-center rounded-full bg-[#001740] text-white font-semibold px-8 py-4 text-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
          >
            <span class="relative z-10">Get Started</span>
            <svg
              class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </router-link>
          <a
            href="#problem-solution"
            class="inline-flex items-center justify-center rounded-full bg-gray-600 text-white font-semibold px-8 py-4 text-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 border border-white/20"
          >
            Learn More
          </a>
        </div>

        <div class="grid grid-cols-3 gap-4 pt-8 max-w-xl mx-auto">
          <div class="text-center">
            <p class="text-2xl font-bold text-[#F5C400]">100%</p>
            <p class="text-base text-gray-500 font-medium mt-1">RFID Coverage</p>
          </div>
          <div class="text-center border-l border-r border-slate-700">
            <p class="text-2xl font-bold text-[#F5C400]">&lt;1s</p>
            <p class="text-base text-gray-500 font-medium mt-1">Response Time</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-[#F5C400]">Live</p>
            <p class="text-base text-gray-500 font-medium mt-1">Availability</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Problem & Solution -->
  <section id="problem-solution" class="bg-gray-50 border-t border-gray-200 py-32">
    <div class="mx-auto max-w-screen-xl 2xl:max-w-screen-2xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-12 lg:grid-cols-2 items-center">
        <!-- Text content -->
        <div>
          <p class="text-sm font-semibold tracking-[0.25em] uppercase text-[#001740]">Problem & Solution</p>
          <h2 class="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900">
            Tired of wandering around looking for your professor?
          </h2>
          <p class="mt-4 text-base sm:text-lg text-gray-600 max-w-xl">
            Students often struggle to locate professors across multiple rooms and changing schedules. This leads to
            wasted time, missed consultations, and unnecessary delays in getting academic support.
          </p>
          <p class="mt-6 text-base sm:text-lg font-medium text-[#001740] max-w-xl">
            We built a real-time IoT system that shows who’s in, who’s out, and how to reach them — instantly.
          </p>
        </div>

        <!-- Illustration: Lottie -->
        <div class="relative flex items-center justify-center">
          <dotlottie-player
            src="https://lottie.host/5658b456-028d-4527-b219-25bbb14ca5eb/GTGHn8FjAv.lottie"
            background="transparent"
            speed="1"
            style="width: 100%; height: 100%; max-width: 500px; max-height: 500px;"
            loop
            autoplay
          >
          </dotlottie-player>
        </div>
      </div>
    </div>
  </section>

  <!-- How It Works -->
  <section id="how-it-works" class="bg-white border-t border-gray-200 py-32">
    <div class="mx-auto max-w-screen-xl 2xl:max-w-screen-2xl px-4 sm:px-6 lg:px-8">
      <!-- Heading -->
      <div class="text-center max-w-4xl mx-auto">
        <p class="text-sm font-semibold tracking-[0.25em] uppercase text-[#001740]">How It Works</p>
        <h2 class="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900">
          Real-Time Professor Availability in One Tap
        </h2>
      </div>

      <!-- Steps flow (using provided flow diagram style) -->
      <div class="relative mt-24">
        <div class="relative">
          <div class="flex flex-col lg:flex-row items-stretch justify-between gap-8 lg:gap-4">
            <!-- Step 1 -->
            <div class="flex-1 flex flex-col items-center relative group">
              <div class="relative z-10 mb-6 transform transition-transform duration-300 group-hover:scale-110">
                <div
                  class="w-24 h-24 rounded-full bg-[#102A71] flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Icon icon="iconoir:hand-card" class="w-12 h-12 text-white" />
                </div>
                <div
                  class="absolute -top-2 -right-2 w-8 h-8 bg-[#dbb42e] rounded-full flex items-center justify-center text-white text-sm font-bold"
                >
                  01
                </div>
              </div>
              <h3 class="text-2xl font-bold text-slate-900 mb-2 text-center">Professor taps RFID</h3>
              <p class="text-slate-600 text-center text-sm leading-relaxed max-w-xs">
                Professor taps at the RFID reader to signal their real-time availability.
              </p>
            </div>

            <!-- Step 2 -->
            <div class="flex-1 flex flex-col items-center relative group">
              <div class="relative z-10 mb-6 transform transition-transform duration-300 group-hover:scale-110">
                <div
                  class="w-24 h-24 rounded-full bg-[#102A71] flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Icon icon="fluent:cloud-sync-20-regular" class="w-12 h-12 text-white" />
                </div>
                <div
                  class="absolute -top-2 -right-2 w-8 h-8 bg-[#dbb42e] rounded-full flex items-center justify-center text-white text-sm font-bold"
                >
                  02
                </div>
              </div>
              <h3 class="text-2xl font-bold text-slate-900 mb-2 text-center">Cloud sync</h3>
              <p class="text-slate-600 text-center text-sm leading-relaxed max-w-xs">
                The system instantly updates the professor's status in the secure cloud database.
              </p>
            </div>

            <!-- Step 3 -->
            <div class="flex-1 flex flex-col items-center relative group">
              <div class="relative z-10 mb-6 transform transition-transform duration-300 group-hover:scale-110">
                <div
                  class="w-24 h-24 rounded-full bg-[#102A71] flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Icon icon="solar:server-square-update-outline" class="w-12 h-12 text-white" />
                </div>
                <div
                  class="absolute -top-2 -right-2 w-8 h-8 bg-[#dbb42e] rounded-full flex items-center justify-center text-white text-sm font-bold"
                >
                  03
                </div>
              </div>
              <h3 class="text-2xl font-bold text-slate-900 mb-2 text-center">Dashboard update</h3>
              <p class="text-slate-600 text-center text-sm leading-relaxed max-w-xs">
                The TAP2FIND PWA refreshes, showing live availability on the dashboard.
              </p>
            </div>

            <!-- Step 4 -->
            <div class="flex-1 flex flex-col items-center relative group">
              <div class="relative z-10 mb-6 transform transition-transform duration-300 group-hover:scale-110">
                <div
                  class="w-24 h-24 rounded-full bg-[#102A71] flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Icon icon="fluent:desktop-cursor-24-regular" class="w-12 h-12 text-white" />
                </div>
                <div
                  class="absolute -top-2 -right-2 w-8 h-8 bg-[#dbb42e] rounded-full flex items-center justify-center text-white text-sm font-bold"
                >
                  04
                </div>
              </div>
              <h3 class="text-2xl font-bold text-slate-900 mb-2 text-center">Instant connect</h3>
              <p class="text-slate-600 text-center text-sm leading-relaxed max-w-xs">
                Students view availability or send an inquiry instantly from the web app.
              </p>
            </div>

            <!-- Step 5 -->
            <div class="flex-1 flex flex-col items-center relative group">
              <div class="relative z-10 mb-6 transform transition-transform duration-300 group-hover:scale-110">
                <div
                  class="w-24 h-24 rounded-full bg-[#102A71] flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Icon
                    icon="streamline-ultimate:alert-bell-notification-2"
                    class="w-12 h-12 text-white"
                  />
                </div>
                <div
                  class="absolute -top-2 -right-2 w-8 h-8 bg-[#dbb42e] rounded-full flex items-center justify-center text-white text-sm font-bold"
                >
                  05
                </div>
              </div>
              <h3 class="text-2xl font-bold text-slate-900 mb-2 text-center">SMS notification</h3>
              <p class="text-slate-600 text-center text-sm leading-relaxed max-w-xs">
                The professor receives an SMS notification when a student sends an inquiry.
              </p>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="text-center mt-16">
          <router-link
            to="/features"
            class="inline-flex items-center gap-2 px-8 py-3 hover:bg-[#102A71] bg-[#001740] text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Learn How It Works
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { Icon } from '@iconify/vue'

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

<style scoped>
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes float-delayed {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(20px);
  }
}

:global(.animate-float) {
  animation: float 6s ease-in-out infinite;
}

:global(.animate-float-delayed) {
  animation: float-delayed 6s ease-in-out infinite;
  animation-delay: 1s;
}
</style>
