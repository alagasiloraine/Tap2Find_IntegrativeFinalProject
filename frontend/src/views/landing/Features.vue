<template>
  <div class="bg-white min-h-screen">
    <!-- Header band -->
    <section class="bg-[#001740] text-white min-h-[40vh] flex items-center">
      <div class="max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
        <p class="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-white/80">Key Features</p>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold">Built for Real-Time Visibility</h1>
        <p class="text-sm sm:text-base md:text-lg text-white/80 max-w-3xl mx-auto">
          TAP2FIND unifies RFID hardware, live dashboards, and SMS to keep students and professors in sync—without
          the guesswork.
        </p>
      </div>
    </section>

    <!-- Overlapping feature cards -->
    <section class="relative -mt-16 sm:-mt-20">
      <div class="max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="grid gap-8 sm:gap-10 lg:gap-12 lg:grid-cols-4 bg-white rounded-3xl shadow-[0_24px_70px_rgba(15,23,42,0.18)] border border-gray-200 px-6 sm:px-10 py-10 sm:py-12"
        >
          <div v-for="feature in features" :key="feature.title" class="flex flex-col items-center text-center gap-4">
            <div
              class="w-14 h-14 rounded-full bg-[#001740] flex items-center justify-center text-white shadow-lg mb-1"
            >
              <Icon :icon="feature.icon" class="w-8 h-8" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900">{{ feature.title }}</h3>
            <p class="text-sm text-gray-600 leading-relaxed max-w-xs">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive Feature Walkthrough -->
    <section class="py-20 bg-white border-t border-gray-100">
      <div class="max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <p class="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#001740]">
            Interactive Feature Walkthrough
          </p>
          <h2 class="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
            Experience TAP2FIND in Action
          </h2>
        </div>

        <div class="flex flex-col lg:flex-row items-stretch justify-between gap-8 lg:gap-6">
          <div
            v-for="step in walkthroughSteps"
            :key="step.label"
            class="flex-1 flex flex-col items-center text-center gap-3"
          >
            <div class="relative">
              <div
                class="w-12 h-12 rounded-full bg-[#102A71] text-white flex items-center justify-center text-sm font-bold shadow-md mb-3"
              >
                {{ step.step }}
              </div>
              <div
                class="w-16 h-16 rounded-full border border-dashed border-[#4fb5c1] flex items-center justify-center bg-teal-50/60 shadow-sm"
              >
                <Icon :icon="step.icon" class="w-7 h-7 text-[#0f766e]" />
              </div>
            </div>
            <h3 class="mt-2 text-sm font-semibold text-gray-900">{{ step.label }}</h3>
            <p class="text-xs text-gray-600 max-w-[11rem]">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- User Experience Highlights -->
    <section class="py-20 bg-gray-50 border-t border-gray-100">
      <div class="max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <p class="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#001740]">
            User Experience Highlights
          </p>
          <h2 class="mt-3 text-2xl sm:text-3xl font-extrabold text-gray-900">
            Designed for CCS Students, Professors, and Admins
          </h2>
        </div>

        <div class="grid gap-8 md:grid-cols-3">
          <div
            v-for="highlight in uxHighlights"
            :key="highlight.title"
            class="flex flex-col items-center text-center bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-8 gap-3"
          >
            <div class="w-12 h-12 rounded-full bg-[#001740] flex items-center justify-center text-white shadow-md mb-1">
              <Icon :icon="highlight.icon" class="w-7 h-7" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900">{{ highlight.title }}</h3>
            <p class="text-sm text-gray-600 leading-relaxed">{{ highlight.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const features = [
  {
    title: 'RFID-Powered Presence',
    icon: 'bx:rfid',
    description: 'Door-mounted RFID readers instantly log professor presence with each tap.',
  },
  {
    title: 'Live Room Status',
    icon: 'uiw:message',
    description: 'Students see live availability and room information before they start walking.',
  },
  {
    title: 'Sync Across Channels',
    icon: 'fluent-mdl2:user-sync',
    description: 'Updates propagate to dashboards and SMS notifications in near real-time.',
  },
  {
    title: 'Schedule-Aware View',
    icon: 'icon-park-outline:calendar',
    description: 'Overlay live presence with class schedules and consultation hours.',
  },
]

const walkthroughSteps = [
  {
    step: '01',
    label: 'RFID Tap',
    icon: 'iconoir:hand-card',
    description: 'Professor taps their assigned RFID tag at the door reader.',
  },
  {
    step: '02',
    label: 'Cloud Update',
    icon: 'fluent:cloud-sync-20-regular',
    description: 'The backend records the status change in the TAP2FIND database.',
  },
  {
    step: '03',
    label: 'Dashboard Refresh',
    icon: 'solar:server-square-update-outline',
    description: 'The web dashboard reflects the new availability state.',
  },
  {
    step: '04',
    label: 'Student View',
    icon: 'fluent-mdl2:contact-list',
    description: 'Students quickly see who is in, out, or busy from any device.',
  },
  {
    step: '05',
    label: 'SMS Alert',
    icon: 'streamline-ultimate:alert-bell-notification-2',
    description: 'Professors receive optional SMS when students send an inquiry.',
  },
]

const uxHighlights = [
  {
    title: 'For Students',
    icon: 'hugeicons:students',
    description: 'Minimize hallway guessing with live room status and quick contact options.',
  },
  {
    title: 'For Professors',
    icon: 'mdi:teacher',
    description: 'Control how and when students reach you with clear availability indicators.',
  },
  {
    title: 'For Admins',
    icon: 'gravity-ui:person-nut-hex',
    description: 'Gain insight into utilization patterns and presence across CCS rooms.',
  },
]
</script>
