
<template>
  <div class="bg-white min-h-screen">
    <!-- Dark header band -->
    <section class="bg-[#001740] text-white min-h-[50vh] flex items-center">
      <div class="max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold">
          The Story Behind TAP2FIND
        </h1>
        <p class="text-sm sm:text-base md:text-lg text-white/80 max-w-5xl mx-auto leading-relaxed">
          Developed under the College of Computer Studies, TAP2FIND began as a research initiative to solve the
          everyday problem of locating professors efficiently. By combining IoT, RFID, and SMS technologies, the
          system bridges communication gaps between students and faculty through real-time updates and instant
          notifications.
        </p>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="py-24 bg-white flex items-center justify-center px-4">
      <div class="max-w-5xl w-full">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Mission Card -->
          <div class="relative">
            <!-- Circular Icon -->
            <div class="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
              <div class="relative">
                <div
                  class="w-20 h-20 bg-[#001740] rounded-full flex items-center justify-center shadow-lg ring-4 ring-white"
                >
                  <Icon icon="wpf:search" class="w-10 h-10 text-white" />
                </div>
              </div>
            </div>

            <!-- Card Body -->
            <div
              class="relative border-2 border-dashed border-[#001740] rounded-2xl p-8 pt-16 bg-white hover:shadow-xl transition-shadow duration-300"
            >
              <!-- Side Handles -->
              <div
                class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-12 bg-[#F5C400] rounded-full"
              ></div>
              <div
                class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-12 bg-[#F5C400] rounded-full"
              ></div>

              <!-- Title -->
              <div class="mb-4 text-center">
                <div class="inline-block border-2 border-[#001740] rounded-full px-6 py-2">
                  <h3 class="text-[#001740] font-bold text-lg tracking-wider uppercase">Mission</h3>
                </div>
              </div>

              <!-- Description -->
              <p class="text-gray-600 text-center leading-relaxed text-base">
                To enhance communication and accessibility within CCS by integrating innovative IoT systems that
                simplify campus interactions.
              </p>
            </div>
          </div>

          <!-- Vision Card -->
          <div class="relative">
            <!-- Circular Icon -->
            <div class="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
              <div class="relative">
                <div
                  class="w-20 h-20 bg-[#001740] rounded-full flex items-center justify-center shadow-lg ring-4 ring-white"
                >
                  <Icon icon="carbon:graph-aggregator" class="w-10 h-10 text-white" />
                </div>
              </div>
            </div>

            <!-- Card Body -->
            <div
              class="relative border-2 border-dashed border-[#001740] rounded-2xl p-8 pt-16 bg-white hover:shadow-xl transition-shadow duration-300"
            >
              <!-- Side Handles -->
              <div
                class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-12 bg-[#F5C400] rounded-full"
              ></div>
              <div
                class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-12 bg-[#F5C400] rounded-full"
              ></div>

              <!-- Title -->
              <div class="mb-6 text-center">
                <div class="inline-block border-2 border-[#001740] rounded-full px-6 py-2">
                  <h3 class="text-[#001740] font-bold text-lg tracking-wider uppercase">Vision</h3>
                </div>
              </div>

              <!-- Description -->
              <p class="text-gray-600 text-center leading-relaxed text-base">
                To establish a digitally connected academic community where every student can locate and reach out to
                professors efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Team -->
    <section class="py-20 bg-white">
      <div class="max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto">
          <p class="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#001740]">Our Team</p>
          <h2 class="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
            The people behind TAP2FIND
          </h2>
          <p class="mt-4 text-sm sm:text-base text-gray-600">
            A multi-disciplinary team of CCS students collaborating on hardware, software, infrastructure, and
            documentation to bring real-time professor availability to life.
          </p>
        </div>

        <!-- Carousel -->
        <div class="mt-12 md:mt-16" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
          <div class="relative overflow-hidden rounded-3xl bg-gray-50 shadow">
            <div class="p-8 sm:p-10 md:p-12">
              <div class="relative">
                <transition name="fade-slide" mode="out-in">
                  <div
                    v-if="currentGroup"
                    :key="currentGroup.title"
                    class="grid gap-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center min-h-[260px] md:min-h-[260px]"
                  >
                    <!-- Left: Role & description -->
                    <div>
                      <h3 class="text-2xl sm:text-3xl font-bold text-gray-900">
                        {{ currentGroup.title }}
                      </h3>
                      <p class="mt-2 text-sm sm:text-base text-gray-600 max-w-md italic">
                        {{ currentGroup.description }}
                      </p>
                    </div>

                    <!-- Right: Members -->
                    <div class="space-y-4">
                      <ul
                        :class="[
                          'flex flex-wrap gap-8 md:gap-10',
                          currentGroup.members.length === 1 ? 'justify-start md:justify-start' : 'justify-center',
                        ]"
                      >
                        <li
                          v-for="member in currentGroup.members"
                          :key="member.name"
                          class="flex flex-col items-center gap-3 px-3 py-3 text-xs sm:text-sm font-medium text-gray-800 transition-all duration-200 min-w-[110px]"
                        >
                          <!-- Avatar with gradient frame and name chip -->
                          <div class="relative">
                            <div class="p-[5px] rounded-full bg-[#001740]">
                              <div
                                :class="[
                                  'rounded-full bg-white flex items-center justify-center overflow-hidden shadow-sm',
                                  currentGroup.members.length >= 4 ? 'w-28 h-28 md:w-28 md:h-28' : 'w-40 h-40',
                                ]"
                              >
                                <img
                                  :src="member.avatar"
                                  :alt="member.name"
                                  :class="[
                                    'object-contain',
                                    currentGroup.members.length >= 4 ? 'w-28 h-28 md:w-28 md:h-28' : 'w-40 h-40',
                                  ]"
                                />
                              </div>
                            </div>
                            <span
                              class="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#dbb42e] text-sm font-medium text-white whitespace-nowrap shadow"
                            >
                              {{ member.name }}
                            </span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>

          <!-- Carousel controls -->
          <div class="mt-8 flex flex-col items-center gap-4">
            <div class="flex items-center gap-3">
              <button
                v-for="(group, index) in teamGroups"
                :key="group.title + '-dot'"
                @click="goToGroup(index)"
                :class="[
                  'h-2.5 rounded-full transition-all duration-300',
                  index === activeGroupIndex ? 'w-7 bg-[#001740]' : 'w-2.5 bg-gray-300 hover:bg-gray-400',
                ]"
                aria-label="Switch team focus group"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Acknowledgment & Institution -->
    <section class="py-32 bg-gray-100 border-t border-gray-200">
      <div class="max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h2 class="text-sm tracking-[0.25em] font-semibold text-[#001740] uppercase">
            Acknowledgment & Institution
          </h2>
          <p class="mt-3 text-2xl sm:text-3xl font-bold text-gray-900">
            Supported by the College of Computer Studies - Mindoro State University
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-8 mt-12 mb-6">
          <!-- CCS Logo -->
          <div class="flex flex-col items-center gap-2">
            <div
              class="rounded-full bg-white shadow flex items-center justify-center border border-gray-200 overflow-hidden"
            >
              <img src="/bsitccs.svg" alt="College of Computer Studies logo" class="h-20 w-20 object-contain" />
            </div>
            <span class="text-xs sm:text-sm font-semibold text-gray-700">College of Computer Studies</span>
          </div>

          <!-- Divider dot -->
          <div class="hidden sm:block h-1 w-1 rounded-full bg-gray-300"></div>

          <!-- MINSU Logo -->
          <div class="flex flex-col items-center gap-2">
            <div
              class="rounded-full bg-white shadow flex items-center justify-center border border-gray-200 overflow-hidden"
            >
              <img src="/minsu.svg" alt="Mindoro State University logo" class="h-20 w-20 object-contain" />
            </div>
            <span class="text-xs sm:text-sm font-semibold text-gray-700">Mindoro State University</span>
          </div>
        </div>

        <p class="mt-4 text-center text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">
          This project was developed under the guidance of CCS faculty and aligns with the department’s goal of
          promoting innovation through IoT.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'

const teamGroups = [
  {
    title: 'Hardware & Embedded Systems',
    icon: 'mdi:chip',
    description:
      'Designing the RFID-powered hardware layer and integrating embedded systems that detect and log professor presence.',
    members: [
      { name: 'Loraine Alagasi', avatar: '/9.svg' },
      { name: 'Kim Anonuevo', avatar: '/6.svg' },
      { name: 'Francis Aday Manlangit', avatar: '/10.svg' },
    ],
  },
  {
    title: 'Raspberry Pi & DevOps',
    icon: 'mdi:raspberry-pi',
    description:
      'Configuring Raspberry Pi nodes, managing deployments, and keeping the TAP2FIND infrastructure running smoothly.',
    members: [{ name: 'Loraine Alagasi', avatar: '/9.svg' }],
  },
  {
    title: 'Backend Development',
    icon: 'mdi:server',
    description:
      'Building APIs, handling real-time status updates, and connecting hardware events to the TAP2FIND database and services.',
    members: [
      { name: 'Cy Kean Angel Dave Perjes', avatar: '/8.svg' },
      { name: 'Kim Ryan Anonuevo', avatar: '/6.svg' },
      { name: 'Rosalyn  Capio', avatar: '/11.svg' },
    ],
  },
  {
    title: 'Frontend Development',
    icon: 'mdi:monitor-dashboard',
    description:
      'Crafting the web interface where students and professors visualize live availability and interact with the system.',
    members: [
      { name: 'Katherine De Leon', avatar: '/1.svg' },
      { name: 'John Darwin Lambon', avatar: '/5.svg' },
      { name: 'Mico Suarez', avatar: '/12.svg' },
    ],
  },
  {
    title: 'Documentation Team',
    icon: 'mdi:file-document-edit-outline',
    description:
      'Documenting workflows, user guides, and research components to clearly communicate how TAP2FIND works.',
    members: [
      { name: 'Lhen Dimailig', avatar: '/3.svg' },
      { name: 'Sharon Caballero', avatar: '/2.svg' },
      { name: 'Jamyca Manibo', avatar: '/7.svg' },
      { name: 'Ellie Rose Almeda', avatar: '/4.svg' },
    ],
  },
  {
    title: 'Content & UX Writing',
    icon: 'mdi:text-box-edit-outline',
    description:
      'Shaping clear, student-friendly copy and UX microcopy that guide users through TAP2FIND with confidence.',
    members: [{ name: 'Ellie Tarriela Almeda', avatar: '/4.svg' }],
  },
]

const activeGroupIndex = ref(0)
const isHovered = ref(false)
let intervalId

const currentGroup = computed(() => teamGroups[activeGroupIndex.value] || null)

const goToGroup = (index) => {
  if (index < 0 || index >= teamGroups.length) return
  activeGroupIndex.value = index
}

const nextGroup = () => {
  activeGroupIndex.value = (activeGroupIndex.value + 1) % teamGroups.length
}

onMounted(() => {
  intervalId = window.setInterval(() => {
    if (!isHovered.value) {
      nextGroup()
    }
  }, 6000)
})

onBeforeUnmount(() => {
  if (intervalId !== undefined) {
    window.clearInterval(intervalId)
  }
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.6s cubic-bezier(0.22, 0.61, 0.36, 1),
    transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
}

/* New slide comes in from the right */
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.fade-slide-enter-to {
  opacity: 1;
  transform: translateX(0);
}

/* Old slide exits slightly to the left */
.fade-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}
</style>
