<template>
  <div class="p-6">
    <!-- Real-time RFID Notification -->
    <div v-if="showRfidNotification" class="fixed top-4 right-4 z-50">
      <div class="bg-blue-500 text-white px-6 py-4 rounded-lg shadow-lg max-w-sm">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-semibold">New RFID Detected</h3>
          <button @click="closeRfidNotification" class="text-white hover:text-blue-200">
            ✖
          </button>
        </div>
        <p class="text-sm mb-3">RFID: <strong class="font-mono">{{ detectedRfid }}</strong></p>
        <p class="text-xs opacity-90 mb-3">This RFID is not assigned to any professor.</p>
        <div class="flex gap-2">
          <button 
            @click="assignDetectedRfid"
            class="flex-1 bg-white text-blue-600 py-2 px-3 rounded text-sm font-medium hover:bg-blue-50"
          >
            Assign Now
          </button>
          <button 
            @click="useInCurrentForm"
            class="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-green-700"
          >
            Use in Form
          </button>
          <button 
            @click="closeRfidNotification"
            class="flex-1 bg-gray-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-gray-700"
          >
            Later
          </button>
        </div>
      </div>
    </div>

    <!-- Assign RFID Modal -->
    <div v-if="showAssignModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Assign RFID to Professor</h3>
          <button class="text-gray-400 hover:text-gray-600" @click="closeAssignModal">✖</button>
        </div>
        <div class="px-6 py-4">
          <p class="text-sm text-gray-700 mb-4">
            Assign RFID <strong class="font-mono">{{ detectedRfid }}</strong> to:
          </p>
          <select 
            v-model="selectedProfessorForAssignment"
            class="w-full border rounded px-3 py-2 text-sm mb-4"
          >
            <option value="">Select a professor...</option>
            <option 
              v-for="prof in professorsWithoutRfid" 
              :key="prof._id" 
              :value="prof._id"
            >
              {{ prof.firstName }} {{ prof.lastName }} - {{ prof.department || 'No department' }}
            </option>
          </select>
          <div v-if="selectedProfessorForAssignment" class="p-3 bg-blue-50 rounded">
            <p class="text-sm text-blue-700">
              Will assign to: <strong>{{ getProfessorName(selectedProfessorForAssignment) }}</strong>
            </p>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button class="px-4 py-2 rounded border" @click="closeAssignModal">Cancel</button>
          <button 
            class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            @click="confirmRfidAssignment"
            :disabled="!selectedProfessorForAssignment"
          >
            Assign RFID
          </button>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Professor Management</h1>
      <div class="flex items-center gap-3">
        <!-- Connection Status -->
        <div class="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
             :class="connectionStatus.class">
          <div class="w-2 h-2 rounded-full" :class="connectionStatus.dotClass"></div>
          {{ connectionStatus.text }}
        </div>
        
        <button
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          @click="openAddModal"
        >
          <span class="mr-2">➕</span> Add Professor
        </button>
      </div>
    </div>

    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <input
            v-model="query"
            type="text"
            placeholder="Search by name, email or department..."
            class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
          />
          <select
            v-model="statusFilter"
            class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div class="text-sm text-gray-500">
          Showing {{ filteredProfessors.length }} of {{ professors.length }} professors
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RFID ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="p in filteredProfessors" :key="p._id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ (p.firstName || '') + ' ' + (p.lastName || '') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ p.facultyPosition || p.department || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span v-if="p.idNumber" class="font-mono bg-gray-100 px-2 py-1 rounded">{{ p.idNumber }}</span>
                <span v-else class="text-gray-400 italic">Not assigned</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ p.emailAddress }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium"
                  :class="p.isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ p.isVerified ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right space-x-2">
                <button class="px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                        @click="openScheduleModal(p)">
                  📅 Manage Schedule
                </button>
                <button class="px-3 py-1.5 rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                        @click="openEditModal(p)">
                  ✏️ Edit
                </button>
                <button class="px-3 py-1.5 rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                        @click="confirmDelete(p)">
                  🗑️ Delete
                </button>
                <button class="px-3 py-1.5 rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
                        @click="resetPassword(p)">
                  🔑 Reset Password
                </button>
                <button
                  class="px-3 py-1.5 rounded-md"
                  :class="p.isVerified ? 'text-gray-700 bg-gray-100 hover:bg-gray-200' : 'text-green-700 bg-green-50 hover:bg-green-100'"
                  @click="toggleDisable(p)"
                >
                  {{ p.isVerified ? 'Disable' : 'Enable' }}
                </button>
              </td>
            </tr>
            <tr v-if="filteredProfessors.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-sm text-gray-500">
                No professors found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Professor Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">{{ editTarget ? 'Edit Professor' : 'Add Professor' }}</h3>
          <button class="text-gray-400 hover:text-gray-600" @click="closeModal">✖</button>
        </div>
        <form class="px-6 py-4 space-y-4" @submit.prevent="submitProfessor">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs text-gray-600 mb-1">First Name</label>
              <input v-model="form.firstName" type="text" required class="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">Last Name</label>
              <input v-model="form.lastName" type="text" required class="w-full border rounded px-3 py-2 text-sm" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs text-gray-600 mb-1">Email</label>
              <input v-model="form.emailAddress" type="email" required class="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">Department</label>
              <input v-model="form.department" type="text" class="w-full border rounded px-3 py-2 text-sm" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs text-gray-600 mb-1">RFID ID</label>
              <div class="flex gap-2">
                <input 
                  v-model="form.rfidId" 
                  type="text" 
                  class="flex-1 border rounded px-3 py-2 text-sm font-mono bg-gray-50"
                  :class="detectedRfid ? 'bg-blue-50 border-blue-300' : ''"
                  placeholder="Tap RFID card or enter manually"
                  :disabled="true"
                />
                <button 
                  v-if="detectedRfid && !editTarget && !form.rfidId"
                  type="button"
                  @click="useDetectedRfid"
                  class="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 whitespace-nowrap"
                >
                  Use Detected
                </button>
              </div>
              <p v-if="detectedRfid && !editTarget" class="text-xs text-blue-600 mt-1">
                RFID <strong>{{ detectedRfid }}</strong> detected and ready for assignment
              </p>
              <p v-else-if="form.rfidId" class="text-xs text-green-600 mt-1">
                RFID assigned: {{ form.rfidId }}
              </p>
              <p v-else class="text-xs text-gray-500 mt-1">
                Tap an RFID card or use the detected RFID to assign
              </p>
            </div>
            <div v-if="!editTarget">
              <label class="block text-xs text-gray-600 mb-1">Password</label>
              <input v-model="form.password" type="password" required class="w-full border rounded px-3 py-2 text-sm" />
            </div>
          </div>
          <div class="pt-2 flex items-center justify-end gap-3">
            <button type="button" class="px-4 py-2 rounded border" @click="closeModal">Cancel</button>
            <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
              {{ editTarget ? 'Save Changes' : 'Create Professor' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Manual Schedule Modal -->
    <div v-if="scheduleTarget" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            Set Schedule for {{ scheduleTarget.firstName }} {{ scheduleTarget.lastName }}
          </h3>
          <button class="text-gray-400 hover:text-gray-600" @click="closeScheduleModal">✖</button>
        </div>
        
        <div class="px-6 py-4 overflow-auto" style="max-height: calc(90vh - 120px)">
          <!-- Schedule Builder Form -->
          <div class="mb-6 p-4 bg-blue-50 rounded-lg">
            <h4 class="text-lg font-medium text-gray-900 mb-4">Add Schedule Entry</h4>
            <div class="grid grid-cols-5 gap-4">
              <div>
                <label class="block text-xs text-gray-600 mb-1 font-medium">Day</label>
                <select v-model="newSchedule.day" class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </select>
              </div>
              
              <div>
                <label class="block text-xs text-gray-600 mb-1 font-medium">Start Time</label>
                <select v-model="newSchedule.startTime" class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option v-for="time in timeOptions" :key="'start-' + time.value" :value="time.value">
                    {{ time.label }}
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-xs text-gray-600 mb-1 font-medium">End Time</label>
                <select v-model="newSchedule.endTime" class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option v-for="time in timeOptions" :key="'end-' + time.value" :value="time.value">
                    {{ time.label }}
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-xs text-gray-600 mb-1 font-medium">Subject</label>
                <input v-model="newSchedule.subject" type="text" 
                       class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                       placeholder="e.g., Mathematics">
              </div>
              
              <div>
                <label class="block text-xs text-gray-600 mb-1 font-medium">Room</label>
                <input v-model="newSchedule.room" type="text" 
                       class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                       placeholder="e.g., Room 101">
              </div>
            </div>
            
            <div class="mt-4 flex items-center justify-between">
              <div class="text-sm text-gray-600">
                <span class="font-medium">Duration:</span> {{ calculateDuration() }}
              </div>
              <button @click="addScheduleEntry" 
                      :disabled="!isValidSchedule"
                      class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium">
                Add to Schedule
              </button>
            </div>
          </div>

          <!-- Current Schedule List -->
          <div v-if="currentSchedule.length > 0" class="mb-6">
            <h4 class="text-lg font-medium text-gray-900 mb-3">Current Schedule Entries</h4>
            <div class="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
              <div v-for="(schedule, index) in currentSchedule" :key="schedule.id" 
                   class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50">
                <div class="flex items-center gap-6">
                  <span class="text-sm font-medium text-gray-700 w-24">{{ schedule.day }}</span>
                  <span class="text-sm text-gray-600 w-32">{{ formatTimeDisplay(schedule.startTime) }} - {{ formatTimeDisplay(schedule.endTime) }}</span>
                  <span class="text-sm text-blue-600 font-medium">{{ schedule.subject }}</span>
                  <span class="text-sm text-gray-500">{{ schedule.room }}</span>
                  <span class="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    {{ schedule.endTime - schedule.startTime }} hour{{ schedule.endTime - schedule.startTime > 1 ? 's' : '' }}
                  </span>
                </div>
                <button @click="removeScheduleItem(index)" 
                        class="text-red-600 hover:text-red-800 text-sm font-medium">
                  Remove
                </button>
              </div>
            </div>
          </div>

          <!-- Weekly Schedule Grid -->
          <div class="border rounded-lg overflow-hidden bg-white">
            <h4 class="text-lg font-medium text-gray-900 mb-4 p-4 border-b">Weekly Schedule Overview</h4>
            <div class="relative">
              <!-- Time labels -->
              <div class="flex">
                <div class="w-24 flex-shrink-0"></div>
                <div v-for="day in days" :key="day" class="flex-1 text-center py-3 text-sm font-medium text-gray-700 border-b">
                  {{ day }}
                </div>
              </div>
              
              <!-- Schedule grid -->
              <div class="flex">
                <!-- Time column -->
                <div class="w-24 flex-shrink-0 border-r">
                  <div v-for="time in timeOptions" :key="time.value" 
                       class="h-16 border-b text-xs text-gray-500 flex items-center justify-center">
                    {{ time.label }}
                  </div>
                </div>
                
                <!-- Days columns -->
                <div v-for="day in days" :key="day" class="flex-1 relative border-r last:border-r-0">
                  <!-- Time slots background -->
                  <div v-for="time in timeOptions" :key="time.value" 
                       class="h-16 border-b hover:bg-gray-50 cursor-pointer"
                       @click="selectTimeSlot(day, time.value)">
                  </div>
                  
                  <!-- Schedule blocks -->
                  <div v-for="schedule in getSchedulesForDay(day)" 
                       :key="schedule.id"
                       class="absolute left-1 right-1 rounded-lg border-2 p-2 shadow-sm"
                       :class="getScheduleBlockClass(schedule)"
                       :style="getScheduleBlockStyle(schedule)">
                    <div class="text-xs font-medium truncate">{{ schedule.subject }}</div>
                    <div class="text-xs truncate">{{ schedule.room }}</div>
                    <div class="text-xs opacity-75">
                      {{ formatTimeDisplay(schedule.startTime) }}-{{ formatTimeDisplay(schedule.endTime) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-gray-50">
          <button class="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 font-medium" 
                  @click="closeScheduleModal">
            Cancel
          </button>
          <button class="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium" 
                  @click="saveSchedule"
                  :disabled="currentSchedule.length === 0">
            {{ currentSchedule.length === 0 ? 'No Schedule Entries' : 'Save Schedule' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div v-if="deleteTarget" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Delete Professor</h3>
        </div>
        <div class="px-6 py-4 text-sm text-gray-700">
          Are you sure you want to delete
          <b>{{ (deleteTarget.firstName || '') + ' ' + (deleteTarget.lastName || '') }}</b>?
          This action cannot be undone.
        </div>
        <div class="px-6 py-4 flex items-center justify-end gap-3">
          <button class="px-4 py-2 rounded border" @click="deleteTarget = null">Cancel</button>
          <button class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700" @click="performDelete">Confirm</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import api from "@/utils/api"

// Reactive data
const professors = ref([])
const loading = ref(false)
const query = ref("")
const statusFilter = ref("")
const showModal = ref(false)
const editTarget = ref(null)
const deleteTarget = ref(null)
const scheduleTarget = ref(null)

// RFID Real-time Detection
const showRfidNotification = ref(false)
const detectedRfid = ref('')
const showAssignModal = ref(false)
const selectedProfessorForAssignment = ref('')

// Connection status
let pollingInterval = null
const isConnected = ref(true)
const lastPollTime = ref('')

// Schedule management data
const currentSchedule = ref([])
const newSchedule = ref({
  day: 'Monday',
  startTime: 7,
  endTime: 8,
  subject: '',
  room: ''
})

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

// Generate time options from 7:00 AM to 6:00 PM
const timeOptions = computed(() => {
  const options = []
  for (let hour = 7; hour <= 18; hour++) {
    options.push({
      value: hour,
      label: hour === 12 ? '12:00 PM' : 
             hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`
    })
  }
  return options
})

// Form data
const form = ref({
  firstName: "",
  lastName: "",
  emailAddress: "",
  department: "",
  rfidId: "",
  password: "",
})

// Connection status
const connectionStatus = computed(() => {
  return {
    text: 'Connected (Polling)',
    class: 'bg-green-100 text-green-800',
    dotClass: 'bg-green-500'
  }
})

// Computed properties
const filteredProfessors = computed(() => {
  const q = query.value.trim().toLowerCase()
  let list = professors.value.filter((p) => {
    const name = ((p.firstName || "") + " " + (p.lastName || "")).toLowerCase()
    const email = (p.emailAddress || "").toLowerCase()
    const dept = (p.facultyPosition || p.department || "").toLowerCase()
    return name.includes(q) || email.includes(q) || dept.includes(q)
  })
  
  if (statusFilter.value === "active") {
    list = list.filter((p) => !!p.isVerified)
  } else if (statusFilter.value === "inactive") {
    list = list.filter((p) => !p.isVerified)
  }
  return list
})

const professorsWithoutRfid = computed(() => {
  return professors.value.filter(prof => !prof.idNumber)
})

// Get all used RFID IDs to prevent duplicates
const usedRfidIds = computed(() => {
  return professors.value
    .filter(prof => prof.idNumber)
    .map(prof => prof.idNumber)
})

const isValidSchedule = computed(() => {
  return newSchedule.value.startTime < newSchedule.value.endTime && 
         newSchedule.value.subject.trim() !== '' &&
         newSchedule.value.room.trim() !== ''
})

// Watch for detected RFID changes
watch(detectedRfid, (newRfid) => {
  if (newRfid && usedRfidIds.value.includes(newRfid)) {
    console.log('⚠️ RFID already in use, ignoring:', newRfid)
    detectedRfid.value = '' // Clear if already used
    return
  }
})

// HTTP Polling for RFID Detection
const startPolling = () => {
  console.log('🔄 Starting RFID polling every 3 seconds...')
  
  // Poll immediately first time
  pollForNewRfids()
  
  // Then set up interval
  pollingInterval = setInterval(() => {
    pollForNewRfids()
  }, 3000)
}

const pollForNewRfids = async () => {
  try {
    const response = await api.get('/rfid/recent-unknown')
    if (response.data.success && response.data.data) {
      const recentRfids = response.data.data
      if (recentRfids.length > 0) {
        const latestRfid = recentRfids[0]
        // Only process if it's a new RFID we haven't seen and not already used
        if (latestRfid.uid !== detectedRfid.value && !usedRfidIds.value.includes(latestRfid.uid)) {
          console.log('📨 Polling found new RFID:', latestRfid.uid)
          handleUnknownRfid(latestRfid.uid)
        }
      }
      lastPollTime.value = new Date().toLocaleTimeString()
    }
  } catch (error) {
    console.error('❌ Polling error:', error)
  }
}

const handleUnknownRfid = (rfid) => {
  console.log('🔔 Unknown RFID detected:', rfid)
  detectedRfid.value = rfid
  showRfidNotification.value = true
  
  // Auto-hide notification after 15 seconds
  setTimeout(() => {
    if (showRfidNotification.value) {
      closeRfidNotification()
    }
  }, 15000)
}

const closeRfidNotification = () => {
  showRfidNotification.value = false
  detectedRfid.value = ''
}

const assignDetectedRfid = () => {
  showRfidNotification.value = false
  showAssignModal.value = true
  selectedProfessorForAssignment.value = ''
}

const useInCurrentForm = () => {
  if (showModal.value) {
    // If add/edit modal is open, auto-fill the RFID field
    form.value.rfidId = detectedRfid.value
  } else {
    // If no modal is open, open the add modal with the RFID pre-filled
    openAddModal()
    form.value.rfidId = detectedRfid.value
  }
  showRfidNotification.value = false
}

const useDetectedRfid = () => {
  form.value.rfidId = detectedRfid.value
  detectedRfid.value = '' // Clear after using
}

const closeAssignModal = () => {
  showAssignModal.value = false
  selectedProfessorForAssignment.value = ''
  detectedRfid.value = '' // Clear detected RFID when closing assign modal
}

const getProfessorName = (professorId) => {
  const professor = professors.value.find(p => p._id === professorId)
  return professor ? `${professor.firstName} ${professor.lastName}` : ''
}

const confirmRfidAssignment = async () => {
  try {
    if (!selectedProfessorForAssignment.value) {
      alert('Please select a professor')
      return
    }

    const payload = {
      rfid: detectedRfid.value,
      userId: selectedProfessorForAssignment.value,
      userRole: 'professor'
    }

    await api.post('/rfid/assign', payload)
    
    // Refresh professors list
    await fetchProfessors()
    
    // Clear detected RFID
    detectedRfid.value = ''
    
    showAssignModal.value = false
    selectedProfessorForAssignment.value = ''
    
    alert('RFID assigned successfully!')
    
  } catch (error) {
    console.error('Error assigning RFID:', error)
    alert(error.response?.data?.message || 'Failed to assign RFID')
  }
}

// Existing methods
const fetchProfessors = async () => {
  try {
    loading.value = true
    const res = await api.get("/admin/professors")
    professors.value = res.data.professors || []
  } catch (e) {
    console.error("Failed to fetch professors", e)
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  editTarget.value = null
  form.value = {
    firstName: "",
    lastName: "",
    emailAddress: "",
    department: "",
    rfidId: detectedRfid.value || "", // Pre-fill with detected RFID
    password: "",
  }
  showModal.value = true
}

const openEditModal = (p) => {
  editTarget.value = p
  form.value = {
    firstName: p.firstName || "",
    lastName: p.lastName || "",
    emailAddress: p.emailAddress || "",
    department: p.facultyPosition || p.department || "",
    rfidId: p.idNumber || "", // Use idNumber field from database
    password: "",
  }
  showModal.value = true
}

const openScheduleModal = async (p) => {
  scheduleTarget.value = p
  currentSchedule.value = []
  
  try {
    // Load existing manual schedule if any - UPDATED ENDPOINT
    const response = await api.get(`/admin/professors/${p._id}/schedule/manual`)
    if (response.data.schedule) {
      currentSchedule.value = response.data.schedule
    }
  } catch (e) {
    // If 404, it means no schedule exists yet - that's fine
    if (e?.response?.status !== 404) {
      console.error('Failed to load schedule:', e)
    }
  }
}

const closeScheduleModal = () => {
  scheduleTarget.value = null
  currentSchedule.value = []
  resetNewSchedule()
}

const closeModal = () => {
  showModal.value = false
  detectedRfid.value = '' // Clear detected RFID when closing modal
}

const resetNewSchedule = () => {
  newSchedule.value = {
    day: 'Monday',
    startTime: 7,
    endTime: 8,
    subject: '',
    room: ''
  }
}

const submitProfessor = async () => {
  try {
    // Check if RFID is already used (except when editing the same professor)
    if (form.value.rfidId && usedRfidIds.value.includes(form.value.rfidId)) {
      const currentProfessor = editTarget.value
      if (!currentProfessor || currentProfessor.idNumber !== form.value.rfidId) {
        alert('This RFID is already assigned to another professor. Please use a different RFID.')
        return
      }
    }

    if (editTarget.value) {
      const payload = {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        emailAddress: form.value.emailAddress,
        idNumber: form.value.rfidId,
      }
      await api.patch(`/admin/users/${editTarget.value._id}`, payload)
      showModal.value = false
      await fetchProfessors()
      return
    }
    
    const payload = {
      role: "professor",
      emailAddress: form.value.emailAddress,
      password: form.value.password,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      idNumber: form.value.rfidId,
      contactNumber: "",
      facultyPosition: form.value.department,
    }
    await api.post("/admin/add-professor", payload)
    showModal.value = false
    await fetchProfessors()
    alert("Professor created. A verification code has been sent to their email.")
  } catch (e) {
    console.error("Failed to submit professor", e)
    alert("Failed to submit professor")
  }
}

// Schedule management methods
const formatTimeDisplay = (hour) => {
  if (hour === 12) return '12:00 PM'
  if (hour > 12) return `${hour - 12}:00 PM`
  return `${hour}:00 AM`
}

const calculateDuration = () => {
  const duration = newSchedule.value.endTime - newSchedule.value.startTime
  return `${duration} hour${duration > 1 ? 's' : ''}`
}

const addScheduleEntry = () => {
  if (!isValidSchedule.value) {
    alert('Please fill in all fields and ensure end time is after start time.')
    return
  }
  
  // Validate time range
  if (newSchedule.value.startTime < 7 || newSchedule.value.endTime > 19) {
    alert('Schedule time must be between 7:00 AM and 6:00 PM.')
    return
  }

  // Validate duration (max 4 hours per session)
  const duration = newSchedule.value.endTime - newSchedule.value.startTime;
  if (duration > 4) {
    alert('Schedule duration cannot exceed 4 hours per session.');
    return;
  }

  // Check for overlapping schedules on the same day
  const hasOverlap = currentSchedule.value.some(schedule => {
    if (schedule.day !== newSchedule.value.day) return false;
    
    return (
      (newSchedule.value.startTime >= schedule.startTime && newSchedule.value.startTime < schedule.endTime) ||
      (newSchedule.value.endTime > schedule.startTime && newSchedule.value.endTime <= schedule.endTime) ||
      (newSchedule.value.startTime <= schedule.startTime && newSchedule.value.endTime >= schedule.endTime)
    );
  });
  
  if (hasOverlap) {
    alert('This time slot overlaps with an existing schedule on the same day!');
    return;
  }
  
  const scheduleEntry = {
    id: Date.now() + Math.random(),
    day: newSchedule.value.day,
    startTime: newSchedule.value.startTime,
    endTime: newSchedule.value.endTime,
    subject: newSchedule.value.subject.trim(),
    room: newSchedule.value.room.trim()
  };
  
  currentSchedule.value.push(scheduleEntry);
  // Sort schedules by day and time for better organization
  currentSchedule.value.sort((a, b) => {
    const dayOrder = { 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5 };
    if (dayOrder[a.day] !== dayOrder[b.day]) {
      return dayOrder[a.day] - dayOrder[b.day];
    }
    return a.startTime - b.startTime;
  });
  
  resetNewSchedule();
}

const removeScheduleItem = (index) => {
  currentSchedule.value.splice(index, 1)
}

const getSchedulesForDay = (day) => {
  return currentSchedule.value.filter(schedule => schedule.day === day)
}

const getScheduleBlockStyle = (schedule) => {
  const startHour = schedule.startTime
  const endHour = schedule.endTime
  const duration = endHour - startHour
  const top = (startHour - 7) * 64 // 64px per hour (4rem)
  const height = duration * 64 // 64px per hour
  
  return {
    top: `${top}px`,
    height: `${height}px`
  }
}

const getScheduleBlockClass = (schedule) => {
  const colors = [
    'bg-blue-100 border-blue-300 text-blue-800',
    'bg-green-100 border-green-300 text-green-800',
    'bg-purple-100 border-purple-300 text-purple-800',
    'bg-orange-100 border-orange-300 text-orange-800',
    'bg-pink-100 border-pink-300 text-pink-800'
  ]
  const index = currentSchedule.value.findIndex(s => s.id === schedule.id) % colors.length
  return colors[index]
}

const selectTimeSlot = (day, hour) => {
  newSchedule.value.day = day
  newSchedule.value.startTime = hour
  newSchedule.value.endTime = hour + 1
  // Auto-focus on subject input for better UX
  setTimeout(() => {
    const subjectInput = document.querySelector('input[placeholder*="Mathematics"]')
    if (subjectInput) subjectInput.focus()
  }, 100)
}

const saveSchedule = async () => {
  try {
    if (!scheduleTarget.value) return;
    
    // Validate schedule entries
    if (currentSchedule.value.length === 0) {
      alert('Please add at least one schedule entry before saving.');
      return;
    }

    // Prepare data for API - remove temporary IDs
    const scheduleData = currentSchedule.value.map(schedule => ({
      day: schedule.day,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      subject: schedule.subject,
      room: schedule.room
    }));

    console.log('Saving schedule data:', scheduleData);

    // UPDATED ENDPOINT - using manual schedule endpoint
    const response = await api.post(`/admin/professors/${scheduleTarget.value._id}/schedule/manual`, {
      schedule: scheduleData
    });

    if (response.data.success) {
      alert(`Schedule saved successfully! ${response.data.scheduleCount} entries added.`);
      closeScheduleModal();
    } else {
      alert(response.data.message || 'Failed to save schedule');
    }
    
  } catch (e) {
    console.error('Failed to save schedule:', e);
    
    if (e.response?.data?.message) {
      alert(e.response.data.message);
    } else if (e.code === 'NETWORK_ERROR' || !navigator.onLine) {
      alert('Network error. Please check your connection and try again.');
    } else {
      alert('Failed to save schedule. Please try again.');
    }
  }
}

const confirmDelete = (p) => {
  deleteTarget.value = p
}

const performDelete = async () => {
  try {
    if (!deleteTarget.value) return
    await api.delete(`/admin/users/${deleteTarget.value._id}`)
    deleteTarget.value = null
    await fetchProfessors()
  } catch (e) {
    console.error("Failed to delete professor", e)
    alert("Failed to delete professor")
  }
}

const toggleDisable = async (p) => {
  try {
    await api.patch(`/admin/users/${p._id}`, { isVerified: !p.isVerified })
    await fetchProfessors()
  } catch (e) {
    console.error("Failed to toggle account state", e)
    alert("Failed to update account state")
  }
}

const resetPassword = async (p) => {
  try {
    await api.post('/auth/forgot-password', { emailAddress: p.emailAddress })
    alert('Password reset email has been sent to ' + p.emailAddress + '.')
  } catch (e) {
    console.error('Failed to request password reset', e)
    alert(e?.response?.data?.message || 'Failed to request password reset')
  }
}

// Lifecycle
onMounted(() => {
  fetchProfessors()
  startPolling()
})

onUnmounted(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
  }
})
</script>