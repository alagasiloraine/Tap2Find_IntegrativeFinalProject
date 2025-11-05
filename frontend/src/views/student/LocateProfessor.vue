<template>
  <div class="bg-white min-h-screen pb-20 md:pb-8 p-4 md:p-4">
    <!-- Top Bar with Notifications and Profile -->
    <StudentTopNav />

    <!-- Content Division -->
    <div class="px-4 md:px-6 py-4 min-h-0">
      <!-- Search and Filter Section -->
      <div>
      <!-- Search Bar -->
      <div class="mb-4">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <div class="relative flex gap-2">
              <div class="relative">
                <iconify-icon icon="fluent:search-16-filled" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              v-model="searchQuery"
                  @focus="showSearchDropdown = true"
                  @blur="hideSearchDropdown"
                  placeholder="Search professor name..."
                  class="w-96 pl-10 pr-4 py-2 rounded-full bg-gray-50 focus:outline-none"
                />
              
              <!-- Search Dropdown -->
              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="showSearchDropdown && searchQuery && searchResults.length > 0"
                  class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                >
                  <div
                    v-for="professor in searchResults"
                    :key="professor.id"
                    @click="selectProfessor(professor)"
                    class="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <!-- Profile Picture -->
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3">
                      <span class="text-white text-sm font-bold">{{ professor.name.split(' ').map(n => n[0]).join('') }}</span>
                    </div>
                    
                    <!-- Professor Info -->
                    <div class="flex-1">
                      <p class="font-medium text-gray-900">{{ professor.name }}</p>
                      <p class="text-sm text-gray-600">{{ professor.position }}</p>
                    </div>
                    
                    <!-- Status Indicator -->
                    <div class="ml-2">
                      <span class="w-2 h-2 rounded-full"
                        :class="professor.available === 'available' ? 'bg-green-500' : professor.available === 'busy' ? 'bg-red-500' : 'bg-gray-500'"
                      ></span>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
          </div>
          <div class="flex items-center">
            <iconify-icon
              @click="toggleFilterSlider"
              icon="mage:filter-fill"
              class="text-xl cursor-pointer transition-colors"
              :class="(showFilterSlider || selectedYearLevel !== '' || selectedStatus !== null) ? 'text-[#102A71]' : 'text-gray-600'"
            ></iconify-icon>
          </div>
        </div>
      </div>
      
      <!-- Applied Filters -->
      <div v-if="selectedYearLevel !== '' || selectedStatus !== null" class="mb-6">
        <div class="flex flex-wrap gap-2">
          <span 
            v-if="selectedYearLevel !== ''"
            class="px-3 py-3 bg-gray-50 text-gray-700 rounded-lg text-sm"
          >
            {{ selectedYearLevelText }}
          </span>
          <span 
            v-if="selectedStatus !== null"
            class="px-3 py-3 bg-gray-50 text-gray-700 rounded-lg text-sm"
          >
            {{ getStatusText(selectedStatus) }}
          </span>
        </div>
      </div>

      <!-- Results -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="professor in filteredProfessors"
          :key="professor.id"
          :data-professor-id="professor.id"
          class="bg-gray-50 rounded-lg p-4 transition-shadow relative"
        >
          <div class="absolute top-6 right-4 text-[11px] text-gray-500 flex items-center gap-1">
            <iconify-icon icon="mingcute:time-line" class="text-base" />
            <span>Updated {{ formatRelativeTime(professor.statusUpdatedAt) }}</span>
          </div>
          <div class="flex items-center gap-4">
            <!-- Professor Avatar -->
            <div class="flex-shrink-0 flex items-center justify-center">
              <div class="w-32 h-32 bg-gradient-to-br from-blue-300 to-blue-500 rounded-lg flex items-center justify-center">
                <span class="text-white text-2xl font-bold">{{ professor.name.split(' ').map(n => n[0]).join('') }}</span>
            </div>
          </div>
          
            <!-- Professor Info -->
            <div class="flex-1 flex flex-col min-w-0">
              <!-- Name -->
              <h3 class="font-medium text-gray-900 text-xl truncate">{{ professor.name }}</h3>
              
              <!-- Course/Department -->
              <p class="text-sm text-gray-600 mb-2 truncate">{{ professor.position }}</p>
              
              <!-- Status Badge -->
              <span class="px-2 py-1 rounded-lg text-xs font-medium w-fit inline-flex items-center gap-1"
                :class="professor.available === 'available' 
                  ? 'bg-green-100 text-green-700' 
                  : professor.available === 'busy' 
                  ? 'bg-pink-100 text-pink-700' 
                  : 'bg-gray-100 text-gray-700'"
              >
                <iconify-icon :icon="getStatusIcon(professor.available)" class="h-3 w-3" />
                <span>{{ getStatusText(professor.available) }}</span>
              </span>
              
              <!-- Location and Send Inquiry Button -->
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center text-sm text-gray-400">
                  <iconify-icon icon="lucide:map-pin" class="h-3 w-3 mr-1 flex-shrink-0" />
                  <span class="truncate">{{ professor.inFaculty ? 'Faculty' : 'Not in Faculty' }}</span>
                </div>
                
                <button
                  @click="contactProfessor(professor)"
                  class="bg-[#102A71] text-white py-2 px-4 rounded-lg hover:bg-[#102A71]/80 transition-colors text-sm flex items-center justify-center flex-shrink-0"
                >
                  <iconify-icon icon="lucide:send" class="mr-2 h-4 w-4" />
                  Send Inquiry
                </button>
              </div>
            </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay Background -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showFilterSlider"
        @click="toggleFilterSlider"
        class="fixed inset-0 bg-black/50 z-40"
      ></div>
    </transition>

    <!-- Preload the Lottie embed offscreen so it shows instantly when needed -->
    <div aria-hidden="true" style="position:fixed;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;">
      <iframe
        src="https://lottie.host/embed/12c2d475-24c5-4adf-a40d-b5516dc7d3ec/OSssZMqvoJ.lottie"
        width="1"
        height="1"
        style="border:0;"
        title="preload-inquiry-animation"
        loading="eager"
      ></iframe>
    </div>

    <!-- Filter Slider Container -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="transform translate-x-full"
      enter-to-class="transform translate-x-0"
      leave-active-class="transition ease-in duration-300"
      leave-from-class="transform translate-x-0"
      leave-to-class="transform translate-x-full"
    >
      <div
        v-if="showFilterSlider"
        class="fixed top-0 bottom-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-[#001740]">
          <h2 class="text-xl text-white font-semibold">Filter</h2>
        </div>

        <!-- Filter Content -->
        <div class="px-6 py-6 pb-32">
          <!-- Year Level Filter -->
          <div class="mb-8">
            <h3 class="text-base font-semibold mb-4">Year Level</h3>
            <div class="grid grid-cols-2 gap-3">
            <button
                v-for="option in yearLevelOptions"
                :key="option.value"
                @click="selectYearLevel(option.value)"
                class="px-4 py-3 rounded-lg transition-colors font-normal"
                :class="selectedYearLevel === option.value 
                  ? 'text-[#102A71] border border-[#102A71] bg-white' 
                  : 'border border-transparent bg-gray-50 text-gray-400 hover:bg-gray-50'"
              >
                {{ option.label }}
            </button>
            </div>
          </div>

          <!-- Status Filter -->
          <div>
            <h3 class="text-base font-semibold mb-4">Status</h3>
            <div class="grid grid-cols-2 gap-3">
            <button
                v-for="status in statusOptions"
                :key="status.value"
                @click="selectStatusFilter(status.value)"
                class="px-4 py-3 rounded-lg transition-colors font-normal"
                :class="selectedStatus === status.value 
                  ? 'text-[#102A71] border border-[#102A71] bg-white' 
                  : 'border border-transparent bg-gray-50 text-gray-400 hover:bg-gray-50'"
              >
                {{ status.label }}
            </button>
          </div>
        </div>
      </div>

        <!-- Footer Buttons -->
        <div class="fixed bottom-0 right-0 max-w-md w-full  bg-white px-6 py-4 flex gap-3 z-10">
          <button
            @click="toggleFilterSlider"
            class="flex-1 px-4 py-3  rounded-lg  bg-gray-50 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            @click="applyFilters"
            class="flex-1 px-4 py-3 bg-[#F5C400] text-white rounded-lg font-medium hover:bg-[#F5C400]/80 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </transition>

    <!-- Concern Inquiry Modal -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showInquiryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 scale-95 transform translate-y-4"
          enter-to-class="opacity-100 scale-100 transform translate-y-0"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 scale-100 transform translate-y-0"
          leave-to-class="opacity-0 scale-95 transform translate-y-4"
        >
          <div class="bg-white rounded-xl w-full max-w-md">
        <!-- Modal Header -->
        <div class="bg-white border-b border-gray-200 rounded-t-xl px-6 py-4 flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-900">Send Inquiry</h3>
        </div>

        <!-- Modal Body -->
        <div class="px-6 py-4">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">To:</label>
            <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
              <p class="font-medium text-gray-900">{{ selectedProfessor?.name }}</p>
              <p class="text-sm text-gray-600">{{ selectedProfessor?.position }}</p>
            </div>
          </div>



          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Message:</label>
            <textarea
              v-model="inquiryForm.message"
              rows="5"
              placeholder="Type your message here..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            ></textarea>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4  flex justify-end space-x-3">
          <button
            @click="closeInquiryModal"
            class="bg-gray-50 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="submitInquiry"
            class="px-4 py-2 bg-[#102A71] text-white rounded-lg hover:bg-[#102A71]/90 transition-colors flex items-center"
          >
            <iconify-icon icon="lucide:send" class="mr-2 h-4 w-4" />
            Send Inquiry
          </button>
      </div>
          </div>
        </transition>
      </div>
    </transition>
    
    <!-- Animation Overlay (no modal) -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showAnimationModal" class="fixed inset-0 z-[9999]">
        <!-- Dimmed, slightly blurred backdrop -->
        <div class="absolute inset-0 bg-white/80"></div>
        <!-- Centered animation -->
        <div class="relative w-full h-full flex items-center justify-center">
          <iframe
            src="https://lottie.host/embed/9272594d-8fc4-423c-9907-fcabd3b70aa7/rVpKRtzvIm.lottie"
            class="w-56 h-56 md:w-64 md:h-64"
            style="border:0;"
            title="Inquiry sent animation"
            @load="onAnimationLoaded"
          ></iframe>
        </div>
      </div>
    </transition>

    

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StudentTopNav from '@/components/StudentTopNav.vue'

// Reactive data
const searchQuery = ref('')
const selectedYearLevel = ref('')
const selectedStatus = ref(null)
const showInquiryModal = ref(false)
const showAnimationModal = ref(false)
const selectedProfessor = ref(null)
const showSearchDropdown = ref(false)
const showYearLevelDropdown = ref(false)
const showFilterSlider = ref(false)

const inquiryForm = ref({
  subject: '',
  message: ''
})

// Animation control
let animationHideTimer = null

const yearLevelOptions = ref([
  { value: '', label: 'All Year Levels' },
  { value: 'first-year', label: 'First Year' },
  { value: 'second-year', label: 'Second Year' },
  { value: 'third-year', label: 'Third Year' },
  { value: 'fourth-year', label: 'Fourth Year' }
])

const statusOptions = ref([
  { value: null, label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'not-available', label: 'Not Available' },
  { value: 'busy', label: 'Busy' }
])

const professors = ref([
  {
    id: 1,
    name: 'Prof. Pauline Alvarez',
    email: 'paulina.alvarez@university.edu',
    department: 'Computer Science',
    office: 'IT Room 202',
    position: 'Professor',
    inFaculty: true,
    yearLevel: 'first-year',
    available: 'available',
    statusUpdatedAt: Date.now() - 5 * 60 * 1000
  },
  {
    id: 2,
    name: 'Dr. Jane Doe',
    email: 'jane.doe@university.edu',
    department: 'Mathematics',
    office: 'Building B, Room 205',
    position: 'Associate Professor',
    inFaculty: true,
    yearLevel: 'second-year',
    available: 'available',
    statusUpdatedAt: Date.now() - 35 * 60 * 1000
  },
  {
    id: 3,
    name: 'Dr. Robert Johnson',
    email: 'robert.johnson@university.edu',
    department: 'Physics',
    office: 'Building C, Room 310',
    position: 'Lecturer',
    inFaculty: false,
    yearLevel: 'third-year',
    available: 'busy',
    statusUpdatedAt: Date.now() - 2 * 60 * 60 * 1000
  },
  {
    id: 4,
    name: 'Dr. Emily Williams',
    email: 'emily.williams@university.edu',
    department: 'Chemistry',
    office: 'Building D, Room 415',
    position: 'Assistant Professor',
    inFaculty: false,
    yearLevel: 'fourth-year',
    available: 'not-available',
    statusUpdatedAt: Date.now() - 26 * 60 * 60 * 1000
  }
])

// Computed
const selectedYearLevelText = computed(() => {
  const option = yearLevelOptions.value.find(opt => opt.value === selectedYearLevel.value)
  return option ? option.label : 'All Year Levels'
})

const searchResults = computed(() => {
  if (!searchQuery.value) return []
  return professors.value.filter(professor => 
      professor.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  ).slice(0, 5) // Limit to 5 results for dropdown
})

const filteredProfessors = computed(() => {
  return professors.value.filter(professor => {
    const matchesSearch = professor.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesYearLevel = selectedYearLevel.value === '' || professor.yearLevel === selectedYearLevel.value
    const matchesStatus = selectedStatus.value === null || professor.available === selectedStatus.value
    return matchesSearch && matchesYearLevel && matchesStatus
  })
})

// No special feature flags required

// Methods
const searchProfessors = () => {
  console.log('Searching professors...', searchQuery.value, selectedYearLevel.value)
}

const hideSearchDropdown = () => {
  // Delay hiding to allow click on dropdown items
  setTimeout(() => {
    showSearchDropdown.value = false
  }, 200)
}

const selectProfessor = (professor) => {
  searchQuery.value = professor.name
  showSearchDropdown.value = false
  // Optionally scroll to the selected professor in the results
  const professorElement = document.querySelector(`[data-professor-id="${professor.id}"]`)
  if (professorElement) {
    professorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const toggleYearLevelDropdown = () => {
  showYearLevelDropdown.value = !showYearLevelDropdown.value
  showSearchDropdown.value = false
}

const toggleFilterSlider = () => {
  showFilterSlider.value = !showFilterSlider.value
  showYearLevelDropdown.value = false
  showSearchDropdown.value = false
}

const selectYearLevel = (value) => {
  selectedYearLevel.value = value
  showYearLevelDropdown.value = false
}

const selectStatusFilter = (value) => {
  selectedStatus.value = value
}

const applyFilters = () => {
  // Filters are already applied through reactive computed properties
  toggleFilterSlider()
}

const filterByStatus = (status) => {
  selectedStatus.value = status
}

const contactProfessor = (professor) => {
  selectedProfessor.value = professor
  showInquiryModal.value = true
  inquiryForm.value = {
    subject: professor.position,
    message: ''
  }
}

const closeInquiryModal = () => {
  showInquiryModal.value = false
  selectedProfessor.value = null
}

const submitInquiry = () => {
  console.log('Sending inquiry to:', selectedProfessor.value.name)
  console.log('Subject:', inquiryForm.value.subject)
  console.log('Message:', inquiryForm.value.message)
  // TODO: send the inquiry via API. After success:
  closeInquiryModal()
  showAnimationModal.value = true
  // Fallback: auto-hide after 5s in case load doesn't fire
  if (animationHideTimer) clearTimeout(animationHideTimer)
  animationHideTimer = setTimeout(() => {
    showAnimationModal.value = false
  }, 5000)
}

const closeAnimationModal = () => {
  showAnimationModal.value = false
  if (animationHideTimer) {
    clearTimeout(animationHideTimer)
    animationHideTimer = null
  }
}

const onAnimationLoaded = () => {
  // When iframe loads, give time for the animation to play, then hide
  if (animationHideTimer) clearTimeout(animationHideTimer)
  animationHideTimer = setTimeout(() => {
    showAnimationModal.value = false
    animationHideTimer = null
  }, 3000)
}

const viewProfile = (professor) => {
  console.log('Viewing profile:', professor.name)
}

const getStatusText = (status) => {
  if (status === 'available') return 'Available'
  if (status === 'busy') return 'Busy'
  return 'Not Available'
}

const getStatusIcon = (status) => {
  if (status === 'available') return 'lucide:circle-check'
  if (status === 'busy') return 'lucide:clock'
  return 'lucide:circle-x'
}

const formatRelativeTime = (ts) => {
  if (!ts) return 'just now'
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return d === 1 ? '1 day ago' : `${d} days ago`
}
</script>

