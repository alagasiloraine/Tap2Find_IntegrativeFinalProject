<template>
  <div class="bg-white min-h-screen pb-20 md:pb-8 p-4 md:p-4">
    <ProfessorTopNav />
    <div class="px-4 md:px-6 py-4 min-h-0">
      <div class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="rounded-2xl shadow p-5 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 grid place-items-center">
              <iconify-icon icon="material-symbols:mail-outline" class="text-2xl" />
            </div>
            <div>
              <div class="text-gray-600">Total Concerns</div>
              <div class="text-3xl font-bold">{{ totalConcerns }}</div>
            </div>
          </div>
          <div class="rounded-2xl shadow p-5 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 grid place-items-center">
              <iconify-icon icon="tabler:mail-up" class="text-2xl" />
            </div>
            <div>
              <div class="text-gray-600">Pending</div>
              <div class="text-3xl font-bold">{{ pendingCount }}</div>
            </div>
          </div>
          <div class="rounded-2xl shadow p-5 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-green-100 text-green-600 grid place-items-center">
              <iconify-icon icon="mdi:email-check-outline" class="text-2xl" />
            </div>
            <div>
              <div class="text-gray-600">Resolved</div>
              <div class="text-3xl font-bold">{{ resolvedCount }}</div>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex-1 min-w-[200px] max-w-md">
            <div class="relative">
              <iconify-icon icon="fluent:search-16-filled" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search ..."
                class="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 text-sm focus:outline-none  focus:border-transparent"
              />
            </div>
          </div>
          <div class="flex flex-wrap gap-3">
            <!-- Status Dropdown -->
            <div class="relative dropdown-container">
              <button
                @click="openDropdowns.status = !openDropdowns.status"
                class="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm min-w-[140px] text-left flex items-center justify-between"
              >
                <span>{{ filters.status || 'All Status' }}</span>
                <iconify-icon 
                  icon="mdi:chevron-down" 
                  class="text-lg transition-transform duration-200"
                  :class="{ 'rotate-180': openDropdowns.status }"
                />
              </button>
              <Transition name="dropdown">
                <div v-if="openDropdowns.status" class="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                  <button
                    @click="filters.status = ''; openDropdowns.status = false"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    :class="{ 'bg-blue-50 text-blue-600': filters.status === '' }"
                  >
                    All Status
                  </button>
                  <button
                    @click="filters.status = 'Pending'; openDropdowns.status = false"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    :class="{ 'bg-blue-50 text-blue-600': filters.status === 'Pending' }"
                  >
                    Pending
                  </button>
                  <button
                    @click="filters.status = 'Resolved'; openDropdowns.status = false"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    :class="{ 'bg-blue-50 text-blue-600': filters.status === 'Resolved' }"
                  >
                    Resolved
                  </button>
                </div>
              </Transition>
            </div>

            <!-- Year Level Dropdown -->
            <div class="relative dropdown-container">
              <button
                @click="openDropdowns.yearLevel = !openDropdowns.yearLevel"
                class="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm min-w-[160px] text-left flex items-center justify-between"
              >
                <span>{{ filters.yearLevel || 'All Year Level' }}</span>
                <iconify-icon 
                  icon="mdi:chevron-down" 
                  class="text-lg transition-transform duration-200"
                  :class="{ 'rotate-180': openDropdowns.yearLevel }"
                />
              </button>
              <Transition name="dropdown">
                <div v-if="openDropdowns.yearLevel" class="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                  <button
                    @click="filters.yearLevel = ''; openDropdowns.yearLevel = false"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    :class="{ 'bg-blue-50 text-blue-600': filters.yearLevel === '' }"
                  >
                    All Year Level
                  </button>
                  <button
                    @click="filters.yearLevel = 'First Year'; openDropdowns.yearLevel = false"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    :class="{ 'bg-blue-50 text-blue-600': filters.yearLevel === 'First Year' }"
                  >
                    First Year
                  </button>
                  <button
                    @click="filters.yearLevel = 'Second Year'; openDropdowns.yearLevel = false"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    :class="{ 'bg-blue-50 text-blue-600': filters.yearLevel === 'Second Year' }"
                  >
                    Second Year
                  </button>
                  <button
                    @click="filters.yearLevel = 'Third Year'; openDropdowns.yearLevel = false"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    :class="{ 'bg-blue-50 text-blue-600': filters.yearLevel === 'Third Year' }"
                  >
                    Third Year
                  </button>
                  <button
                    @click="filters.yearLevel = 'Fourth Year'; openDropdowns.yearLevel = false"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    :class="{ 'bg-blue-50 text-blue-600': filters.yearLevel === 'Fourth Year' }"
                  >
                    Fourth Year
                  </button>
                </div>
              </Transition>
            </div>

            <!-- Section Dropdown -->
            <div class="relative dropdown-container">
              <button
                @click="openDropdowns.section = !openDropdowns.section"
                class="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm min-w-[140px] text-left flex items-center justify-between"
              >
                <span>{{ filters.section || 'All Section' }}</span>
                <iconify-icon 
                  icon="mdi:chevron-down" 
                  class="text-lg transition-transform duration-200"
                  :class="{ 'rotate-180': openDropdowns.section }"
                />
              </button>
              <Transition name="dropdown">
                <div v-if="openDropdowns.section" class="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto">
                  <button
                    @click="filters.section = ''; openDropdowns.section = false"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    :class="{ 'bg-blue-50 text-blue-600': filters.section === '' }"
                  >
                    All Section
                  </button>
                  <button
                    v-for="s in sectionOptions"
                    :key="s"
                    @click="filters.section = s; openDropdowns.section = false"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    :class="{ 'bg-blue-50 text-blue-600': filters.section === s }"
                  >
                    {{ s }}
                  </button>
                </div>
              </Transition>
            </div>

            <!-- Date Dropdown -->
            <div class="relative dropdown-container">
              <button
                @click="openDropdowns.date = !openDropdowns.date"
                class="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm min-w-[140px] text-left flex items-center justify-between"
              >
                <span>{{ filters.date === 'all' ? 'All Dates' : filters.date === 'today' ? 'Today' : 'This Week' }}</span>
                <iconify-icon 
                  icon="mdi:chevron-down" 
                  class="text-lg transition-transform duration-200"
                  :class="{ 'rotate-180': openDropdowns.date }"
                />
              </button>
              <Transition name="dropdown">
                <div v-if="openDropdowns.date" class="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                  <button
                    @click="filters.date = 'all'; openDropdowns.date = false"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    :class="{ 'bg-[#102A71] text-blue-600': filters.date === 'all' }"
                  >
                    All Dates
                  </button>
                  <button
                    @click="filters.date = 'today'; openDropdowns.date = false"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    :class="{ 'bg-[#102A71] text-blue-600': filters.date === 'today' }"
                  >
                    Today
                  </button>
                  <button
                    @click="filters.date = 'week'; openDropdowns.date = false"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    :class="{ 'bg-[#102A71] text-blue-600': filters.date === 'week' }"
                  >
                    This Week
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full align-middle">
              <thead class="bg-[#102A71] text-white text-xs uppercase tracking-wide">
                <tr>
                  <th class="text-left px-6 py-4 font-semibold">Student</th>
                  <th class="text-left px-6 py-4 font-semibold">Section</th>
                  <th class="text-left px-6 py-4 font-semibold">Message</th>
                  <th class="text-left px-6 py-4 font-semibold">Submitted</th>
                  <th class="text-left px-6 py-4 font-semibold">Status</th>
                  <th class="text-left px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="item in filteredConcerns" :key="item.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm text-gray-900">
                    <div class="flex items-center gap-3">
                      <img v-if="item.avatar" :src="item.avatar" alt="avatar" class="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow" />
                      <div v-else class="w-9 h-9 rounded-full bg-gray-200 grid place-items-center ring-2 ring-white shadow">
                        <iconify-icon icon="mdi:account" class="text-gray-500" />
                      </div>
                      <div class="flex flex-col">
                        <span class="font-medium">{{ item.student }}</span>
                        <span class="text-xs text-gray-500">{{ item.yearLevel }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span class="inline-flex items-center gap-1 px-2 py-1 text-gray-700">{{ item.section }}</span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-700">
                    <div class="max-w-[420px]">
                      <p class="line-clamp-2">{{ item.message }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{{ formatDate(item.submittedAt) }}</td>
                  <td class="px-6 py-4 text-sm">
                    <span
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border"
                      :class="item.status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'"
                    >
                      <span class="w-2 h-2 rounded-full"
                        :class="item.status === 'Resolved' ? 'bg-green-500' : 'bg-amber-500'">
                      </span>
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <div class="flex items-center gap-2">
                      <button @click="viewConcern(item)" class="group inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors">
                        <iconify-icon icon="lets-icons:view" class="text-base group-hover:text-gray-800" />
                        <span class="hidden sm:inline text-xs">View</span>
                      </button>
                      <button
                        @click="resolveConcern(item)"
                        class="group inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-colors"
                        :class="item.status === 'Pending' ? 'border-amber-300 text-amber-700 hover:bg-amber-50' : 'border-green-300 text-green-700 hover:bg-green-50'"
                      >
                        <iconify-icon :icon="item.status === 'Pending' ? 'tabler:mail-up' : 'mdi:email-check-outline'" class="text-base" />
                        <span class="hidden sm:inline text-xs">{{ item.status === 'Pending' ? 'Resolve' : 'Resolved' }}</span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredConcerns.length === 0">
                  <td colspan="6" class="px-6 py-10 text-center text-sm text-gray-500">
                    <div class="flex flex-col items-center gap-2">
                      <iconify-icon icon="mdi:email-off-outline" class="text-3xl text-gray-300" />
                      <span>No concerns found</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <!-- View Concern Modal -->
    <Transition name="modal">
      <div v-if="isViewModalOpen" class="fixed inset-0 z-[100] grid place-items-center">
        <div class="absolute inset-0 bg-black/40" @click="closeViewModal"></div>
        <div class="relative w-[90%] max-w-md rounded-2xl shadow-xl overflow-hidden bg-white">
          <!-- Header -->
          <div class="flex items-center gap-3 bg-gray-100 px-4 py-3">
            <div class="w-10 h-10 rounded-full bg-gray-200 grid place-items-center overflow-hidden">
              <img v-if="selectedConcern?.avatar" :src="selectedConcern?.avatar" alt="avatar" class="w-full h-full object-cover" />
              <iconify-icon v-else icon="mdi:account-circle" class="text-3xl text-gray-400" />
            </div>
            <div class="flex-1">
              <div class="font-semibold text-gray-900">{{ selectedConcern?.student }}</div>
              <div class="text-xs text-gray-600">{{ formatDate(selectedConcern?.submittedAt || new Date().toISOString()) }}</div>
            </div>
          </div>

          <!-- Body -->
          <div class="p-5">
            <div class="text-sm text-gray-700 whitespace-pre-line">{{ selectedConcern?.message }}</div>

            <div class="mt-6 grid grid-cols-2 gap-3">
              <button
                @click="declineSelected()"
                class="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium "
              >
                Decline
              </button>
              <button
                @click="acceptSelected()"
                class="px-4 py-2 rounded-xl bg-[#102A71] text-white font-medium "
              >
                Accept
              </button>
            </div>
          </div>

          <!-- Close -->
          <button @click="closeViewModal" class="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
            <iconify-icon icon="mdi:close" class="text-2xl" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import ProfessorTopNav from '@/components/ProfessorTopNav.vue'
const concerns = ref([
  { id: 1, student: 'Emma Johnson', avatar: 'https://i.pravatar.cc/100?u=Emma%20Johnson', yearLevel: 'First Year', section: 'F1', message: 'I am having difficulty understanding the mathematics syllabus, partic…', submittedAt: '2024-11-04T10:30:00', status: 'Pending' },
  { id: 2, student: 'Liam Smith', avatar: 'https://i.pravatar.cc/100?u=Liam%20Smith', yearLevel: 'Second Year', section: 'F2', message: 'Need clarification on the assignment deadline for the final project.', submittedAt: '2024-11-04T09:15:00', status: 'Resolved' },
  { id: 3, student: 'Sophia Chen', avatar: 'https://i.pravatar.cc/100?u=Sophia%20Chen', yearLevel: 'First Year', section: 'F3', message: 'Can I get more time for the lab report? I have other deadlines.', submittedAt: '2024-11-03T15:45:00', status: 'Pending' },
  { id: 4, student: 'James Wilson', avatar: 'https://i.pravatar.cc/100?u=James%20Wilson', yearLevel: 'Third Year', section: 'F4', message: 'Not feeling well, requesting attendance exemption for today.', submittedAt: '2024-11-03T08:00:00', status: 'Resolved' },
  { id: 5, student: 'Ava Martinez', avatar: 'https://i.pravatar.cc/100?u=Ava%20Martinez', yearLevel: 'Second Year', section: 'F5', message: 'Having trouble accessing the course materials on the portal.', submittedAt: '2024-11-02T14:20:00', status: 'Pending' },
])

const filters = ref({ status: '', yearLevel: '', section: '', date: 'all' })
const searchQuery = ref('')
const openDropdowns = ref({
  status: false,
  yearLevel: false,
  section: false,
  date: false
})

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.dropdown-container')) {
    openDropdowns.value = {
      status: false,
      yearLevel: false,
      section: false,
      date: false
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const getSectionOptionsForYearLevel = (yearLevel) => {
  if (!yearLevel) return []
  const sections = {
    'First Year': ['F1', 'F2', 'F3', 'F4', 'F5', 'F6'],
    'Second Year': ['F1', 'F2', 'F3', 'F4', 'F5', 'F6'],
    'Third Year': ['F1', 'F2', 'F3', 'F4', 'F5'],
    'Fourth Year': ['F1', 'F2', 'F3', 'F4']
  }
  return sections[yearLevel] || []
}

const sectionOptions = computed(() => {
  if (filters.value.yearLevel) {
    return getSectionOptionsForYearLevel(filters.value.yearLevel)
  }
  return Array.from(new Set(concerns.value.map(c => c.section))).sort()
})

// Reset section filter when year level changes
watch(() => filters.value.yearLevel, () => {
  if (filters.value.section && filters.value.yearLevel) {
    const availableSections = getSectionOptionsForYearLevel(filters.value.yearLevel)
    if (!availableSections.includes(filters.value.section)) {
      filters.value.section = ''
    }
  }
})

const filteredConcerns = computed(() => {
  return concerns.value.filter(c => {
    const statusOk = !filters.value.status || c.status === filters.value.status
    const yearLevelOk = !filters.value.yearLevel || c.yearLevel === filters.value.yearLevel
    const sectionOk = !filters.value.section || c.section === filters.value.section
    let dateOk = true
    if (filters.value.date !== 'all') {
      const d = new Date(c.submittedAt)
      const now = new Date()
      if (filters.value.date === 'today') {
        dateOk = d.toDateString() === now.toDateString()
      } else if (filters.value.date === 'week') {
        const first = new Date(now)
        const day = now.getDay() || 7
        first.setDate(now.getDate() - day + 1)
        first.setHours(0,0,0,0)
        const last = new Date(first)
        last.setDate(first.getDate() + 6)
        last.setHours(23,59,59,999)
        dateOk = d >= first && d <= last
      }
    }
    const searchOk = !searchQuery.value || 
      c.student.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.message.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.section.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (c.yearLevel && c.yearLevel.toLowerCase().includes(searchQuery.value.toLowerCase()))
    return statusOk && yearLevelOk && sectionOk && dateOk && searchOk
  })
})

const totalConcerns = computed(() => concerns.value.length)
const pendingCount = computed(() => concerns.value.filter(c => c.status === 'Pending').length)
const resolvedCount = computed(() => concerns.value.filter(c => c.status === 'Resolved').length)

// Modal state
const isViewModalOpen = ref(false)
const selectedConcern = ref(null)

function openViewModal(item) {
  selectedConcern.value = { ...item }
  isViewModalOpen.value = true
}

function closeViewModal() {
  isViewModalOpen.value = false
}

function viewConcern(item) { openViewModal(item) }
function resolveConcern(item) { item.status = 'Resolved' }

function acceptSelected() {
  if (!selectedConcern.value) return
  const idx = concerns.value.findIndex(c => c.id === selectedConcern.value.id)
  if (idx !== -1) concerns.value[idx].status = 'Resolved'
  closeViewModal()
}

function declineSelected() {
  if (!selectedConcern.value) return
  const idx = concerns.value.findIndex(c => c.id === selectedConcern.value.id)
  if (idx !== -1 && concerns.value[idx].status !== 'Resolved') {
    concerns.value[idx].status = 'Pending'
  }
  closeViewModal()
}

function formatDate(iso) {
  const d = new Date(iso)
  const opts = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }
  return d.toLocaleString(undefined, opts)
}
</script>

<style scoped>
/* Dropdown Fade + Slide Down Transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Modal fade */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
