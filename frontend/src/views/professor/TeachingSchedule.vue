<template>
  <div class="bg-white min-h-screen pb-20 md:pb-8 p-4 md:p-4">
    <ProfessorTopNav :hide-actions="true" />

    <!-- Main Content: Calendar + Sidebar -->
    <div class="px-4 md:px-6 py-4 min-h-0">
      <div v-if="loadingSchedule" class="flex flex-col md:flex-row gap-6">
        <div class="inline-block min-w-full md:min-w-0 md:flex-1">
          <div class="rounded-lg shadow-xl overflow-hidden p-4">
            <div class="h-6 w-40 bg-gray-200 rounded animate-pulse mb-3"></div>
            <div class="grid grid-cols-6 gap-2 mb-2">
              <div class="h-8 bg-gray-200 rounded animate-pulse" v-for="n in 6" :key="`sk-h-`+n"></div>
            </div>
            <div class="space-y-2">
              <div class="h-16 bg-gray-100 rounded animate-pulse" v-for="n in 6" :key="`sk-r-`+n"></div>
            </div>
          </div>
        </div>
        <div class="md:w-80 w-full md:sticky md:top-4 space-y-4">
          <div class="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
          <div class="bg-white rounded-2xl border border-gray-200 p-4 shadow">
            <div class="h-5 w-48 bg-gray-200 rounded animate-pulse mb-3"></div>
            <div class="space-y-3">
              <div class="flex items-start gap-3" v-for="n in 3" :key="`sk-sb-`+n">
                <div class="w-11 h-11 rounded-md bg-gray-200 animate-pulse"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div class="h-3 w-40 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="flex flex-col md:flex-row gap-6">
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
import { computed, ref, watch, onMounted } from 'vue'
import ProfessorTopNav from '@/components/ProfessorTopNav.vue'
import api from "@/utils/api"

// Toast helper (bottom-right)
const showToast = (message, type = 'success', duration = 2600) => {
  let container = document.getElementById('t2f-toast-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 't2f-toast-container'
    container.style.position = 'fixed'
    container.style.bottom = '16px'
    container.style.right = '16px'
    container.style.zIndex = '9999'
    container.style.display = 'flex'
    container.style.flexDirection = 'column-reverse'
    container.style.gap = '10px'
    document.body.appendChild(container)
  }

  const colors = type === 'success'
    ? { border: '#34D399', text: '#065F46', iconBg: '#ECFDF5', iconFg: '#10B981', bar: '#6EE7B7' }
    : { border: '#F87171', text: '#7F1D1D', iconBg: '#FEF2F2', iconFg: '#EF4444', bar: '#FCA5A5' }

  const toast = document.createElement('div')
  toast.style.minWidth = '280px'
  toast.style.maxWidth = '460px'
  toast.style.background = '#FFFFFF'
  toast.style.border = `1.5px solid ${colors.border}`
  toast.style.borderRadius = '14px'
  toast.style.boxShadow = '0 12px 20px -6px rgba(0,0,0,0.12), 0 6px 10px -4px rgba(0,0,0,0.06)'
  toast.style.overflow = 'hidden'
  toast.style.opacity = '0'
  toast.style.transform = 'translateY(12px)'
  toast.style.transition = 'opacity 220ms ease, transform 220ms ease'

  const row = document.createElement('div')
  row.style.display = 'flex'
  row.style.alignItems = 'center'
  row.style.gap = '12px'
  row.style.padding = '12px 16px'

  const iconWrap = document.createElement('div')
  iconWrap.style.width = '26px'
  iconWrap.style.height = '26px'
  iconWrap.style.borderRadius = '50%'
  iconWrap.style.background = colors.iconBg
  iconWrap.style.display = 'flex'
  iconWrap.style.alignItems = 'center'
  iconWrap.style.justifyContent = 'center'
  iconWrap.style.flex = '0 0 auto'

  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  icon.setAttribute('viewBox', '0 0 24 24')
  icon.setAttribute('width', '16')
  icon.setAttribute('height', '16')
  icon.innerHTML = type === 'success'
    ? `<path d="M9 12.75 11.25 15 15 9.75" fill="none" stroke="${colors.iconFg}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<path d="M12 8v4m0 4h.01" fill="none" stroke="${colors.iconFg}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" fill="none" stroke="${colors.iconFg}" stroke-width="1.5" opacity="0.25"/>`
  iconWrap.appendChild(icon)

  const textBlock = document.createElement('div')
  textBlock.style.display = 'flex'
  textBlock.style.flexDirection = 'column'
  textBlock.style.gap = '2px'
  const title = document.createElement('div')
  title.textContent = type === 'success' ? 'SUCCESS' : 'ERROR'
  title.style.fontSize = '12px'
  title.style.fontWeight = '800'
  title.style.letterSpacing = '0.04em'
  title.style.color = colors.text
  const body = document.createElement('div')
  body.textContent = message
  body.style.fontSize = '14px'
  body.style.fontWeight = '600'
  body.style.color = '#111827'
  textBlock.appendChild(title)
  textBlock.appendChild(body)
  row.appendChild(iconWrap)
  row.appendChild(textBlock)

  const barWrap = document.createElement('div')
  barWrap.style.height = '2px'
  barWrap.style.background = 'transparent'
  barWrap.style.width = '100%'
  const bar = document.createElement('div')
  bar.style.height = '100%'
  bar.style.width = '100%'
  bar.style.background = colors.bar
  bar.style.transition = `width ${duration}ms linear`
  barWrap.appendChild(bar)

  toast.appendChild(row)
  toast.appendChild(barWrap)
  container.appendChild(toast)

  requestAnimationFrame(() => {
    toast.style.opacity = '1'
    toast.style.transform = 'translateY(0)'
    requestAnimationFrame(() => (bar.style.width = '0%'))
  })

  setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transform = 'translateY(8px)'
    setTimeout(() => {
      toast.remove()
      if (!container.childElementCount) container.remove()
    }, 240)
  }, duration)
}
const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']
const backendDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] // Backend expects capitalized

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

// Schedule data - now loaded from API
const scheduleData = ref([])
const loadingSchedule = ref(false)

// Function to load professor's schedule from API
const loadProfessorSchedule = async () => {
  try {
    loadingSchedule.value = true
    // Direct one-liner to get professor ID
    const professorId = JSON.parse(localStorage.getItem('user'))?.id;
    
    if (!professorId) {
      console.error('No professor ID found');
      return;
    }

    console.log('Loading schedule for professor:', professorId);

    // Rest of your existing code...
    const response = await api.get(`/admin/professors/${professorId}/schedule/manual`)
    
    if (response.data.success && response.data.schedule) {
      scheduleData.value = response.data.schedule.map(schedule => ({
        id: schedule._id || Date.now() + Math.random(),
        dayIndex: backendDays.findIndex(day => day === schedule.day),
        startSlot: schedule.startTime - 7,
        duration: schedule.endTime - schedule.startTime,
        name: schedule.subject,
        room: schedule.room,
        location: schedule.location || '',
        color: getColorBySubject(schedule.subject)
      })).filter(schedule => schedule.dayIndex !== -1)
    } else {
      scheduleData.value = []
    }
  } catch (error) {
    console.error('Failed to load professor schedule:', error)
    if (error.response?.status === 404) {
      scheduleData.value = []
    } else {
      showToast('Failed to load schedule: ' + (error.response?.data?.message || error.message), 'error')
    }
  } finally {
    loadingSchedule.value = false
  }
}

// Helper function to assign colors based on subject
const getColorBySubject = (subject) => {
  const colorMap = {
    'ITE': 'emerald',
    'CS': 'sky',
    'IS': 'amber',
    'default': 'violet'
  }
  
  for (const [key, color] of Object.entries(colorMap)) {
    if (subject && subject.toUpperCase().includes(key)) {
      return color
    }
  }
  return colorMap.default
}

// Function to convert frontend schedule to backend format
const convertToBackendFormat = (schedules) => {
  return schedules.map(schedule => ({
    day: backendDays[schedule.dayIndex],
    startTime: schedule.startSlot + 7, // Convert from slot index (0-10) to hour (7-18)
    endTime: schedule.startSlot + 7 + schedule.duration,
    subject: schedule.name,
    room: schedule.room,
    location: schedule.location || ''
  }))
}

// Function to save ALL schedules to API (bulk save)
const saveAllSchedules = async () => {
  try {
    const professorId = JSON.parse(localStorage.getItem('user'))?.id
    if (!professorId) {
      throw new Error('No professor ID found')
    }

    // Convert all schedules to backend format
    const backendScheduleData = convertToBackendFormat(scheduleData.value)

    console.log('Saving schedules to backend:', backendScheduleData)

    const response = await api.post(`/admin/professors/${professorId}/schedule/manual`, {
      schedule: backendScheduleData
    })

    if (response.data.success) {
      return response.data
    } else {
      throw new Error(response.data.message || 'Failed to save schedules')
    }
  } catch (error) {
    console.error('Failed to save schedules:', error)
    throw error
  }
}

// Function to add a new schedule entry (local only, then save all)
const addSchedule = async () => {
  if (selectedDayIndex.value == null) {
    showToast('Please select a day', 'error')
    return
  }
  
  const sh = parseHour(startTime.value)
  const eh = parseHour(endTime.value)
  if (sh == null || eh == null || eh <= sh) {
    showToast('Please select valid start and end times', 'error')
    return
  }

  const startSlotVal = sh - 7
  const durationVal = eh - sh

  // Validate time range
  if (sh < 7 || eh > 18) {
    showToast('Schedule time must be between 7:00 AM and 6:00 PM.', 'error')
    return
  }

  // Validate duration (max 4 hours per session)
  if (durationVal > 4) {
    showToast('Schedule duration cannot exceed 4 hours per session.', 'error')
    return
  }

  // Check for overlapping schedules on the same day
  const hasOverlap = scheduleData.value.some(course => {
    if (course.dayIndex !== selectedDayIndex.value) return false
    
    return (
      (startSlotVal >= course.startSlot && startSlotVal < course.startSlot + course.duration) ||
      (startSlotVal + durationVal > course.startSlot && startSlotVal + durationVal <= course.startSlot + course.duration) ||
      (startSlotVal <= course.startSlot && startSlotVal + durationVal >= course.startSlot + course.duration)
    )
  })
  
  if (hasOverlap) {
    showToast('This time slot overlaps with an existing schedule on the same day!', 'error')
    return
  }

  const newCourse = {
    id: Date.now(), // Temporary ID
    dayIndex: selectedDayIndex.value,
    startSlot: startSlotVal,
    duration: durationVal,
    name: courseNameInput.value || ((yearLevelInput.value && sectionInput.value) ? `${yearLevelInput.value} ${sectionInput.value}` : 'Class'),
    room: roomInput.value || 'TBD',
    location: sectionInput.value || '',
    color: colorInput.value,
  }

  // Add to local data first
  scheduleData.value.push(newCourse)
  
  // Sort schedules by day and time for better organization
  scheduleData.value.sort((a, b) => {
    if (a.dayIndex !== b.dayIndex) {
      return a.dayIndex - b.dayIndex
    }
    return a.startSlot - b.startSlot
  })

  try {
    // Save ALL schedules to backend
    const result = await saveAllSchedules()
    
    // Update the temporary ID with actual backend ID if needed
    // Note: Backend doesn't return individual IDs, so we keep our temporary ones
    
    showAddModal.value = false
    resetForm()
    
    showToast('Schedule added successfully', 'success')
  } catch (error) {
    // Remove the added schedule if save failed
    const index = scheduleData.value.findIndex(course => course.id === newCourse.id)
    if (index !== -1) {
      scheduleData.value.splice(index, 1)
    }
    showToast('Failed to save schedule: ' + (error.response?.data?.message || error.message), 'error')
  }
}

// Function to update an existing schedule entry
const updateSchedule = async () => {
  if (!editingCourse.value) return

  const sh = parseHour(startTime.value)
  const eh = parseHour(endTime.value)
  if (sh == null || eh == null || eh <= sh || selectedDayIndex.value == null) {
    showToast('Please fill all required fields correctly', 'warning')
    return
  }
  
  const startSlotVal = sh - 7
  const durationVal = eh - sh

  // Validate time range
  if (sh < 7 || eh > 18) {
    showToast('Schedule time must be between 7:00 AM and 6:00 PM.', 'warning')
    return
  }

  // Validate duration (max 4 hours per session)
  if (durationVal > 4) {
    showToast('Schedule duration cannot exceed 4 hours per session.', 'warning')
    return
  }

  // Check for overlapping schedules (excluding the current course being edited)
  const hasOverlap = scheduleData.value.some(course => {
    if (course.id === editingCourse.value.id) return false // Skip the course being edited
    if (course.dayIndex !== selectedDayIndex.value) return false
    
    return (
      (startSlotVal >= course.startSlot && startSlotVal < course.startSlot + course.duration) ||
      (startSlotVal + durationVal > course.startSlot && startSlotVal + durationVal <= course.startSlot + course.duration) ||
      (startSlotVal <= course.startSlot && startSlotVal + durationVal >= course.startSlot + course.duration)
    )
  })
  
  if (hasOverlap) {
    showToast('This time slot overlaps with an existing schedule on the same day!', 'warning')
    return
  }

  // Update the course data locally
  const originalCourse = { ...editingCourse.value }
  
  editingCourse.value.dayIndex = selectedDayIndex.value
  editingCourse.value.startSlot = startSlotVal
  editingCourse.value.duration = durationVal
  editingCourse.value.name = courseNameInput.value || editingCourse.value.name
  editingCourse.value.room = roomInput.value || editingCourse.value.room
  editingCourse.value.location = sectionInput.value || editingCourse.value.location
  editingCourse.value.color = colorInput.value || editingCourse.value.color

  try {
    // Save ALL schedules to backend
    const result = await saveAllSchedules()
    closeAddModal()
    showToast(`Schedule updated successfully! ${result.scheduleCount} total entries saved.`, 'success')
  } catch (error) {
    // Revert changes if save failed
    Object.assign(editingCourse.value, originalCourse)
    showToast('Failed to update schedule: ' + (error.response?.data?.message || error.message), 'error')
  }
}

// Function to delete a schedule entry
const deleteSchedule = async () => {
  if (!courseToDelete.value) return
  
  const courseId = courseToDelete.value.id
  const originalSchedules = [...scheduleData.value]
  
  // Remove from local data first
  const idx = scheduleData.value.findIndex(c => c.id === courseId)
  if (idx !== -1) {
    scheduleData.value.splice(idx, 1)
  }

  try {
    // Save ALL schedules to backend
    const result = await saveAllSchedules()
    closeDeleteModal()
    showToast(`Schedule deleted successfully! ${result.scheduleCount} total entries saved.`, 'success')
  } catch (error) {
    // Revert changes if save failed
    scheduleData.value = originalSchedules
    showToast('Failed to delete schedule: ' + (error.response?.data?.message || error.message), 'error')
  }
}

// Modified saveSchedule function
const saveSchedule = async () => {
  if (isEditMode.value && editingCourse.value) {
    await updateSchedule()
  } else {
    await addSchedule()
  }
}

// Modified confirmDelete function
const confirmDelete = async () => {
  if (!courseToDelete.value) return closeDeleteModal()
  await deleteSchedule()
}

// Helper function to reset form
const resetForm = () => {
  selectedDayIndex.value = null
  startTime.value = ''
  endTime.value = ''
  courseNameInput.value = ''
  roomInput.value = ''
  sectionInput.value = ''
  yearLevelInput.value = ''
  colorInput.value = 'violet'
}

// Load schedule when component mounts
onMounted(() => {
  loadProfessorSchedule()
})

// Helpers
const getCoursesForDay = (dayIndex) => scheduleData.value.filter(course => course.dayIndex === dayIndex)

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
  resetForm()
}

const closeAddModal = () => {
  showAddModal.value = false
  openDropdowns.value = { start: false, end: false, year: false, section: false }
  isEditMode.value = false
  editingCourse.value = null
  resetForm()
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
</script>