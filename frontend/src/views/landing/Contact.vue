<template>
  <div class="bg-white min-h-screen">
    <!-- Header band -->
    <section class="bg-[#001740] text-white min-h-[40vh] flex items-center">
      <div class="mx-auto max-w-screen-xl 2xl:max-w-screen-2xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
        <p class="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-white/80">Contact</p>
        <h1 class="text-4xl sm:text-5xl font-extrabold">Get in Touch with TAP2FIND</h1>
        <p class="mt-1 text-white/80 text-base sm:text-lg max-w-2xl mx-auto">
          We’re here to answer questions, gather feedback, and help you get the most out of TAP2FIND.
        </p>
      </div>
    </section>

    <!-- Contact card -->
    <section class="relative">
      <div class="mx-auto max-w-screen-xl 2xl:max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div
          class="-mt-14 sm:-mt-16 rounded-xl border border-gray-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.16)] overflow-hidden"
        >
          <div class="grid gap-8 sm:gap-10 lg:gap-12 lg:grid-cols-2 p-6 sm:p-8 lg:p-10">
            <!-- Left: Contact Info -->
            <div>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900">Contact Information</h2>
              <p class="mt-2 text-gray-600 max-w-prose">
                Our team is here to help you with technical issues, feature suggestions, or general inquiries about how
                TAP2FIND works.
              </p>

              <ul class="mt-6 space-y-4">
                <li class="flex items-start gap-4">
                  <span
                    class="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600"
                  >
                    <Icon icon="mingcute:location-line" class="w-5 h-5" />
                  </span>
                  <div>
                    <div class="font-semibold text-gray-900">Address</div>
                    <div class="text-gray-600">College of Computer Studies – Mindoro State University</div>
                  </div>
                </li>
                <li class="flex items-start gap-4">
                  <span
                    class="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
                  >
                    <Icon icon="ic:outline-email" class="w-5 h-5" />
                  </span>
                  <div>
                    <div class="font-semibold text-gray-900">Email us</div>
                    <div class="text-gray-600">tap2findccs@gmail.com</div>
                  </div>
                </li>
                <li class="flex items-start gap-4">
                  <span
                    class="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600"
                  >
                    <Icon icon="mi:call" class="w-5 h-5" />
                  </span>
                  <div>
                    <div class="font-semibold text-gray-900">Contact us</div>
                    <div class="text-gray-600">+63 995 2225 880</div>
                  </div>
                </li>
                <li class="flex items-start gap-4">
                  <span
                    class="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600"
                  >
                    <Icon icon="fluent-mdl2:date-time-12" class="w-5 h-5" />
                  </span>
                  <div>
                    <div class="font-semibold text-gray-900">Office Hours</div>
                    <div class="text-gray-600">Monday–Friday | 8:00 AM–5:00 PM</div>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Right: Form -->
            <div class="bg-gray-50 rounded-xl p-5 sm:p-6">
              <h3 class="text-2xl font-extrabold text-gray-900">Send us a message</h3>
              <form class="mt-4 space-y-4">
                <div class="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#001740]"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#001740]"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#001740]"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    rows="5"
                    class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#001740]"
                  ></textarea>
                </div>
                <div class="flex items-center justify-between">
                  <p class="text-xs text-gray-500">Our team gets back to you within 24–48 hours.</p>
                  <button
                    type="button"
                    class="inline-flex items-center rounded-full bg-[#F5C400] hover:bg-[#e0b100] text-[#001740] font-semibold px-6 py-3 shadow"
                  >
                    Send message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Feedback CTA with Lottie -->
    <section class="mt-16 mb-20">
      <div class="mx-auto max-w-screen-xl 2xl:max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div
          class="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center rounded-2xl bg-gray-50 border border-gray-200 px-6 sm:px-10 py-10 sm:py-12 shadow-sm"
        >
          <!-- Left: Text + button -->
          <div class="flex flex-col justify-between h-full">
            <div>
              <h3 class="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Help Us Improve TAP2FIND
              </h3>
              <p class="mt-3 text-sm sm:text-base text-gray-600 max-w-lg">
                Share your experience using TAP2FIND—what works well, what’s confusing, and what features you’d like to
                see next. Your feedback directly shapes the future of the system.
              </p>
            </div>
            <div class="mt-6">
              <button
                type="button"
                class="inline-flex items-center rounded-full bg-[#001740] hover:bg-[#102A71] text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Submit Feedback
              </button>
            </div>
          </div>

          <!-- Right: Lottie illustration -->
          <div class="flex items-center justify-center">
            <dotlottie-player
              src="https://lottie.host/0b807f32-4e9c-4db6-8f86-a714867bc0d9/8tVDvfTx4i.lottie"
              background="transparent"
              speed="1"
              style="width: 320px; height: 320px;"
              loop
              autoplay
            >
            </dotlottie-player>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
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
