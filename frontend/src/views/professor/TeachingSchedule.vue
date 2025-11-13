<template>
  <div class="bg-white min-h-screen pb-20 md:pb-8 p-4 md:p-4">
    <ProfessorTopNav :hide-actions="true" />

    <!-- Main Content: Calendar + Sidebar -->
    <div class="px-4 md:px-6 py-4 min-h-0">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Calendar Section -->
        <div class="inline-block min-w-full md:min-w-0 md:flex-1">
          <div class="rounded-lg shadow-xl overflow-hidden">
          <!-- Header Row -->
          <div class="flex">
            <!-- Time Column Header -->
            <div class="w-40 flex-shrink-0 bg-gray-300 border border-gray-300 p-3 flex items-center justify-center">
              <div class="text-sm font-bold text-gray-700 text-center">TIME</div>
            </div>
            
            <!-- Day Headers -->
            <div class="flex flex-1">
              <div v-for="day in days" :key="day" class="flex-1 min-w-24 bg-gray-300 border border-gray-300 p-3">
                <div class="text-sm font-bold text-gray-700 text-center">{{ day }}</div>
              </div>
            </div>
          </div>

          <!-- Time Slots Grid -->
          <div class="flex">
            <!-- Time Column -->
            <div class="w-40 flex-shrink-0 border-l border-r border-gray-300">
              <div v-for="(slot, index) in timeSlots" :key="index" class="h-16 border-b border-gray-300 p-2 flex items-center justify-center">
                <div class="text-sm font-medium text-gray-900 text-center">{{ slot }}</div>
              </div>
            </div>

            <!-- Days Grid -->
            <div class="flex flex-1 relative">
              <div v-for="(day, dayIndex) in days" :key="dayIndex" class="flex-1 min-w-24 border-r border-gray-300 relative">
                <!-- Time slot backgrounds -->
                <div v-for="(slot, slotIndex) in timeSlots" :key="`bg-${slotIndex}`" class="h-16 border-b border-gray-300"></div>

                <!-- Course blocks absolutely positioned -->
                <div v-for="course in getCoursesForDay(dayIndex)" :key="`${course.id}-${dayIndex}`" 
                     :style="{
                       top: `${course.startSlot * slotHeight + blockVInset}px`,
                       height: `${course.duration * slotHeight - blockVInset * 2}px`
                     }"
                     :class="['group absolute left-1 right-1 rounded-lg border-l-4 p-2 flex flex-col justify-center items-center text-center', courseColor(course.color || course.location)]">
                  <div class="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button @click.stop="openEditModal(course)" class="px-2 py-0.5 rounded bg-white/80 text-gray-800 text-xs border border-gray-200 hover:bg-white">Edit</button>
                    <button @click.stop="openDeleteModal(course)" class="px-2 py-0.5 rounded bg-white/80 text-red-700 text-xs border border-red-200 hover:bg-white">Delete</button>
                  </div>
                  <div class="text-lg font-semibold text-gray-900 leading-tight">{{ course.name }}</div>
                  <div class="text-xs font-medium text-gray-700 leading-tight">{{ course.room }}</div>
                  <div class="text-xs font-medium text-gray-700 leading-tight">{{ course.location }}</div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        <!-- Right Sidebar -->
        <div class="md:w-80 w-full md:sticky md:top-4 space-y-4">
          <!-- Add Schedule Button -->
          <button type="button" @click="openAddModal" class="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-xl px-5 py-4 flex items-center gap-3 justify-center shadow">
            <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
              <!-- Plus Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m7-7H5" />
              </svg>
            </span>
            <span class="font-semibold text-lg">Add Class Schedule</span>
          </button>

          <!-- Reminder Card -->
          <div class="bg-white rounded-2xl border border-gray-200  p-4 shadow">
            <div class="font-bold text-gray-900 mb-3 text-xl">Your Schedule Today</div>
            <div v-if="todayCourses.length === 0" class="text-sm text-gray-500">No classes scheduled today.</div>
            <ul v-else class="space-y-3">
              <li v-for="(course, idx) in todayCourses" :key="`today-${course.id}`" class="flex items-start gap-3">
                <div :class="['w-11 h-11 rounded-md flex items-center justify-center text-sm font-bold text-gray-800', badgeColor(course.location)]">
                  {{ course.location }}
                </div>
                <div class="flex-1">
                  <div class="text-base font-semibold text-gray-900">{{ getTimeRange(course.startSlot, course.duration) }}</div>
                  <div class="text-xs font-medium text-gray-700">{{ course.name }} | {{ course.room }}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Schedule Modal -->
  <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/40" @click="closeAddModal"></div>

    <!-- Modal Card -->
    <div class="relative w-full max-w-xl bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="bg-[#001740] text-white px-6 py-4">
        <div class="text-2xl font-semibold">{{ isEditMode ? 'Edit Schedule' : 'Add Schedule' }}</div>
      </div>

      <!-- Body -->
      <div class="px-6 py-5 space-y-5">
        <p class="text-sm text-gray-600">Please fill out the details below to add a new class schedule. Ensure all required fields are complete before saving.</p>

        <!-- Day Selector -->
        <div class="grid grid-cols-5 gap-2">
          <button
            v-for="(day, idx) in days"
            :key="`day-${idx}`"
            type="button"
            @click="setDay(idx)"
            :class="[
              'px-3 py-2 rounded-full text-sm font-medium border',
              selectedDayIndex === idx ? 'bg-[#001740] text-white border-[#001740]' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-50'
            ]"
          >
            {{ day.slice(0,3) }}
          </button>
        </div>

        <!-- Time Inputs -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Start:</label>
            <div class="relative">
              <input v-model="startTime" type="time" class="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">End:</label>
            <div class="relative">
              <input v-model="endTime" type="time" class="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none" />
            </div>
          </div>
        </div>

        <!-- Course Name / Course Room -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Course Name</label>
            <input v-model="courseNameInput" type="text" placeholder="(e.g., ITE 211)" class="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Course Room</label>
            <input v-model="roomInput" type="text" placeholder="(e.g., Rm. 204, Lab 2)" class="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none" />
          </div>
        </div>

        <!-- Year Level / Section -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Year Level</label>
            <div class="relative">
              <button type="button" @click="openDropdowns.year = !openDropdowns.year" class="w-full h-10 rounded-lg border border-gray-300 pl-3 pr-9 text-sm text-left">
                <span class="text-gray-700">{{ yearLevelInput || 'Select year level' }}</span>
              </button>
              <svg class="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.06z" clip-rule="evenodd" />
              </svg>
              <Transition name="dropdown">
                <div v-if="openDropdowns.year" class="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                  <button
                    v-for="opt in yearLevelOptions"
                    :key="`year-${opt}`"
                    @click="yearLevelInput = opt; openDropdowns.year = false"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    :class="{ 'bg-blue-50 text-blue-600': yearLevelInput === opt }"
                  >
                    {{ opt }}
                  </button>
                </div>
              </Transition>
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Section</label>
            <div class="relative">
              <button type="button" @click="openDropdowns.section = !openDropdowns.section" class="w-full h-10 rounded-lg border border-gray-300 pl-3 pr-9 text-sm text-left">
                <span class="text-gray-700">{{ sectionInput || 'Select a section' }}</span>
              </button>
              <svg class="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.06z" clip-rule="evenodd" />
              </svg>
              <Transition name="dropdown">
                <div v-if="openDropdowns.section" class="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                  <button
                    v-for="opt in sectionOptions"
                    :key="`section-${opt}`"
                    @click="sectionInput = opt; openDropdowns.section = false"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    :class="{ 'bg-blue-50 text-blue-600': sectionInput === opt }"
                  >
                    {{ opt }}
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- Color selection -->
        <div class="space-y-2">
          <label class="block text-xs font-medium text-gray-700">Color</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="opt in colorOptions"
              :key="opt.key"
              type="button"
              @click="colorInput = opt.key"
              :class="[
                'px-3 py-2 rounded-full text-xs font-medium border flex items-center gap-2',
                colorInput === opt.key ? colorRing(opt.key) : ''
              ]"
            >
              <span :class="['w-4 h-4 rounded-full border', opt.dot]" />
              <span class="text-gray-700">{{ opt.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 flex justify-end gap-3">
        <button type="button" @click="closeAddModal" class="px-5 py-2.5 rounded-full bg-gray-200 text-gray-700 text-sm font-medium">Cancel</button>
        <button type="button" @click="saveSchedule" class="px-5 py-2.5 rounded-full bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold">{{ isEditMode ? 'Save' : 'Add' }}</button>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/40" @click="closeDeleteModal"></div>

    <!-- Modal Card -->
    <div class="relative w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="bg-[#001740] text-white px-6 py-4">
        <div class="text-2xl font-semibold">Delete Schedule</div>
      </div>

      <!-- Body -->
      <div class="px-6 py-5 space-y-3">
        <p class="text-sm text-gray-700">Are you sure you want to delete this schedule? This action cannot be undone.</p>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 flex justify-end gap-3">
        <button type="button" @click="closeDeleteModal" class="px-5 py-2.5 rounded-full bg-gray-200 text-gray-700 text-sm font-medium">Cancel</button>
        <button type="button" @click="confirmDelete" class="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import ProfessorTopNav from '@/components/ProfessorTopNav.vue'

const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']

const timeSlots = [
  '7:00AM-8:00AM',
  '8:00AM-9:00AM',
  '9:00AM-10:00AM',
  '10:00AM-11:00AM',
  '11:00AM-12:00PM',
  '12:00PM-1:00PM',
  '1:00PM-2:00PM',
  '2:00PM-3:00PM',
  '3:00PM-4:00PM',
  '4:00PM-5:00PM',
  '5:00PM-6:00PM'
]

// Height of each time slot in pixels; used for positioning course blocks
const slotHeight = 64

// Vertical inset (px) to create top and bottom spacing between schedule blocks
const blockVInset = 2

// Schedule data: dayIndex (0=Monday, 4=Friday), startSlot (0-10), duration (in slots)
const scheduleData = [
  { id: 1, dayIndex: 0, startSlot: 2, duration: 2, name: 'ITE 411', room: 'ITRM 101', location: '4F1' },
  { id: 2, dayIndex: 0, startSlot: 5, duration: 2, name: 'ITE 211', room: 'ITRM 106', location: '2F1' },
  
  { id: 3, dayIndex: 1, startSlot: 1, duration: 2, name: 'ITE 211', room: 'ITRM 106', location: '2F1' },
  { id: 4, dayIndex: 1, startSlot: 4, duration: 2, name: 'ITE 211', room: 'ITRM 106', location: '2F1' },
  
  { id: 5, dayIndex: 2, startSlot: 2, duration: 1, name: 'ITE 211', room: 'ITRM 106', location: '2F1' },
  { id: 6, dayIndex: 2, startSlot: 4, duration: 2, name: 'ITE 211', room: 'ITRM 106', location: '2F1' },
  
  { id: 7, dayIndex: 3, startSlot: 2, duration: 1, name: 'ITE 211', room: 'ITRM 106', location: '2F1' },
  { id: 8, dayIndex: 3, startSlot: 4, duration: 2, name: 'ITE 211', room: 'ITRM 106', location: '2F1' },
  
  { id: 9, dayIndex: 4, startSlot: 3, duration: 1, name: 'ITE 211', room: 'ITRM 106', location: '2F1' },
  { id: 10, dayIndex: 4, startSlot: 5, duration: 1, name: 'ITE 211', room: 'ITRM 106', location: '2F1' },
  { id: 11, dayIndex: 4, startSlot: 7, duration: 1, name: 'ITE 211', room: 'ITRM 106', location: '2F1' }
]

// Helpers
const getCoursesForDay = (dayIndex) => scheduleData.filter(course => course.dayIndex === dayIndex)

const getTimeRange = (startSlot, duration) => {
  const start = timeSlots[startSlot]?.split('-')[0] || ''
  const endSlot = Math.min(startSlot + duration - 1, timeSlots.length - 1)
  const end = timeSlots[endSlot]?.split('-')[1] || ''
  return `${start} - ${end}`
}

const currentDayIndex = (() => {
  const jsDay = new Date().getDay() // 0=Sun ... 6=Sat
  // Map Mon-Fri -> 0..4, otherwise return -1 for weekend
  return jsDay >= 1 && jsDay <= 5 ? jsDay - 1 : -1
})()

const todayCourses = computed(() => {
  if (currentDayIndex === -1) return []
  return getCoursesForDay(currentDayIndex)
})

const badgeColor = (location) => {
  if (location === '4F1') return 'bg-green-100'
  if (location === '3F3') return 'bg-sky-100'
  return 'bg-yellow-100'
}

const courseColor = (key) => {
  if (key === 'emerald' || key === '4F1') return 'bg-emerald-100 border-emerald-400'
  if (key === 'sky' || key === '3F3') return 'bg-sky-100 border-sky-400'
  if (key === 'amber' || key === '2F1') return 'bg-amber-100 border-amber-400'
  if (key === 'rose') return 'bg-rose-100 border-rose-400'
  if (key === 'indigo') return 'bg-indigo-100 border-indigo-400'
  return 'bg-violet-100 border-violet-400'
}

const colorRing = (key) => {
  if (key === 'emerald') return 'ring-2 ring-offset-1 ring-emerald-400'
  if (key === 'sky') return 'ring-2 ring-offset-1 ring-sky-400'
  if (key === 'amber') return 'ring-2 ring-offset-1 ring-amber-400'
  if (key === 'rose') return 'ring-2 ring-offset-1 ring-rose-400'
  if (key === 'indigo') return 'ring-2 ring-offset-1 ring-indigo-400'
  return 'ring-2 ring-offset-1 ring-violet-400'
}

const showAddModal = ref(false)
const isEditMode = ref(false)
let editingCourse = ref(null)
const selectedDayIndex = ref(null)
const startTime = ref('')
const endTime = ref('')
const roomInput = ref('')
const sectionInput = ref('')
const yearLevelInput = ref('')
const yearLevelOptions = ['First Year', 'Second Year', 'Third Year', 'Fourth Year']
const colorInput = ref('violet')
const colorOptions = [
  { key: 'emerald', label: 'Green', dot: 'bg-emerald-400 border-emerald-500' },
  { key: 'sky', label: 'Sky', dot: 'bg-sky-400 border-sky-500' },
  { key: 'amber', label: 'Amber', dot: 'bg-amber-400 border-amber-500' },
  { key: 'violet', label: 'Violet', dot: 'bg-violet-400 border-violet-500' },
  { key: 'rose', label: 'Rose', dot: 'bg-rose-400 border-rose-500' },
  { key: 'indigo', label: 'Indigo', dot: 'bg-indigo-400 border-indigo-500' },
]
const courseNameInput = ref('')
const openDropdowns = ref({ start: false, end: false, year: false, section: false })

const sectionOptions = computed(() => {
  const map = {
    'First Year': 6,
    'Second Year': 6,
    'Third Year': 5,
    'Fourth Year': 4,
  }
  const count = map[yearLevelInput.value] || 0
  return Array.from({ length: count }, (_, i) => `F${i + 1}`)
})

watch(yearLevelInput, () => {
  sectionInput.value = ''
})

const timeOptions = computed(() => {
  const labels = []
  const format = (h24) => {
    const period = h24 >= 12 ? 'PM' : 'AM'
    const h12 = ((h24 + 11) % 12) + 1
    return `${h12}:00 ${period}`
  }
  for (let h = 7; h <= 18; h++) {
    labels.push(format(h))
  }
  return labels
})

const openAddModal = () => {
  showAddModal.value = true
  isEditMode.value = false
}

const closeAddModal = () => {
  showAddModal.value = false
  openDropdowns.value = { start: false, end: false, year: false, section: false }
  isEditMode.value = false
  editingCourse.value = null
}

const setDay = (idx) => {
  selectedDayIndex.value = idx
}

const parseHour = (label) => {
  if (!label) return null
  // Support formats: '7:00 AM' or '07:00'
  if (label.includes('AM') || label.includes('PM')) {
    const [time, period] = label.split(' ')
    const [hStr] = time.split(':')
    let h = parseInt(hStr, 10)
    if (period === 'PM' && h !== 12) h += 12
    if (period === 'AM' && h === 12) h = 0
    return h
  }
  const [hStr] = label.split(':')
  const h = parseInt(hStr, 10)
  return Number.isFinite(h) ? h : null
}

const addSchedule = () => {
  if (selectedDayIndex.value == null) return closeAddModal()
  const sh = parseHour(startTime.value)
  const eh = parseHour(endTime.value)
  if (sh == null || eh == null || eh <= sh) return closeAddModal()

  const startSlotVal = sh - 7
  const durationVal = eh - sh

  const newCourse = {
    id: Date.now(),
    dayIndex: selectedDayIndex.value,
    startSlot: startSlotVal,
    duration: durationVal,
    name: courseNameInput.value || ((yearLevelInput.value && sectionInput.value) ? `${yearLevelInput.value} ${sectionInput.value}` : 'Class'),
    room: roomInput.value || 'TBD',
    location: sectionInput.value || '',
    color: colorInput.value,
  }
  scheduleData.push(newCourse)
   showAddModal.value = false
}

const saveSchedule = () => {
  if (isEditMode.value && editingCourse.value) {
    const sh = parseHour(startTime.value)
    const eh = parseHour(endTime.value)
    if (sh == null || eh == null || eh <= sh || selectedDayIndex.value == null) return closeAddModal()
    const startSlotVal = sh - 7
    const durationVal = eh - sh
    // mutate the existing course
    editingCourse.value.dayIndex = selectedDayIndex.value
    editingCourse.value.startSlot = startSlotVal
    editingCourse.value.duration = durationVal
    editingCourse.value.name = courseNameInput.value || editingCourse.value.name
    editingCourse.value.room = roomInput.value || editingCourse.value.room
    editingCourse.value.location = sectionInput.value || editingCourse.value.location
    editingCourse.value.color = colorInput.value || editingCourse.value.color
    closeAddModal()
    return
  }
  addSchedule()
}

const openEditModal = (course) => {
  isEditMode.value = true
  editingCourse.value = course
  // Prefill fields
  selectedDayIndex.value = course.dayIndex
  const startHour = 7 + course.startSlot
  const endHour = startHour + course.duration
  const toHH = (n) => String(n).padStart(2, '0')
  startTime.value = `${toHH(startHour)}:00`
  endTime.value = `${toHH(endHour)}:00`
  courseNameInput.value = course.name
  roomInput.value = course.room
  sectionInput.value = course.location
  colorInput.value = course.color || 'violet'
  showAddModal.value = true
}

const showDeleteModal = ref(false)
let courseToDelete = ref(null)

const openDeleteModal = (course) => {
  courseToDelete.value = course
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  courseToDelete.value = null
}

const confirmDelete = () => {
  if (!courseToDelete.value) return closeDeleteModal()
  const idx = scheduleData.findIndex(c => c.id === courseToDelete.value.id)
  if (idx !== -1) scheduleData.splice(idx, 1)
  closeDeleteModal()
}
</script>