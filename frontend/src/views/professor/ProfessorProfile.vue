<template>
  <div class="bg-white min-h-screen pb-20 md:pb-8 p-4 md:p-4">
    <ProfessorTopNav />

    <div class="px-4 md:px-6 pt-8">
      <div class="mb-4">
        <button @click="goBack" class="inline-flex items-center gap-2 text-sm font-medium text-gray-700 ">
          <iconify-icon icon="ion:chevron-back" class="text-base" />
          <span>Back</span>
        </button>
      </div>
      <div class="bg-white shadow rounded-xl p-6">
        <!-- Skeleton for header card -->
        <div v-if="initialLoading">
          <div class="relative rounded-xl overflow-hidden h-40 md:h-56 bg-gray-200 animate-pulse"></div>
          <div class="mt-4 flex flex-col items-center text-center">
            <div class="-mt-12 w-32 h-32 rounded-full ring-4 ring-white overflow-hidden bg-gray-200 animate-pulse"></div>
            <div class="mt-2 flex flex-col items-center justify-center gap-2 w-full">
              <div class="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
              <div class="h-4 bg-gray-200 rounded w-56 animate-pulse"></div>
              <div class="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
            <div class="mt-4 h-9 w-28 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
        <template v-else>
          <div class="relative rounded-xl overflow-hidden h-40 md:h-56">
            <img v-if="form.coverUrl" :src="form.coverUrl" alt="Cover" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full bg-gradient-to-b from-indigo-400 to-indigo-900"></div>
            <button
              v-if="isEditing"
              @click="triggerCoverSelect"
              class="absolute inset-0 flex items-center justify-center bg-black/30 text-white hover:bg-black/40 z-10"
              title="Change cover photo"
              aria-label="Change cover photo">
              <iconify-icon icon="fluent:camera-16-filled" class="text-3xl" />
            </button>
            <input ref="coverInput" type="file" accept="image/*" class="hidden" @change="onCoverSelected" />
          </div>
          <div class="mt-4 flex flex-col items-center text-center">
            <div class="-mt-12 w-32 h-32 rounded-full ring-4 ring-white overflow-hidden bg-white relative z-20 mx-auto">
              <img :src="form.avatarUrl" alt="Profile" class="h-full w-full object-cover" />
              <button 
                v-if="isEditing"
                @click="triggerAvatarSelect"
                class="absolute inset-0 flex items-center justify-center bg-black/45 text-white hover:bg-black/55 z-10"
                title="Change photo"
                aria-label="Change photo">
                <iconify-icon icon="fluent:camera-16-filled" class="text-4xl" />
              </button>
              <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="onAvatarSelected" />
            </div>
            <div class="mt-2 flex flex-col items-center justify-center gap-1">
              <div class="flex items-center justify-center gap-2">
                <h2 class="text-2xl font-bold text-gray-900">{{ fullName }}</h2>
                <iconify-icon icon="lucide:badge-check" class="text-green-500" />
              </div>
              <div class="text-base text-gray-900 font-semibold ">{{ form.emailAddress }}</div>
              <div class="text-sm text-gray-600 font-medium">{{ form.position }}</div>
            </div>
            <div class="mt-4 flex items-center justify-center gap-3">
              <button v-if="!isEditing" class="px-4 py-2 rounded-full bg-[#F5C400] text-white shadow-sm text-sm font-medium hover:opacity-90" @click="startEdit">Edit Profile</button>
              <template v-else>
                <button class="px-4 py-2 rounded-full border border-gray-300 shadow-sm text-sm font-medium hover:bg-gray-50" @click="onReset">Reset</button>
                <button class="px-4 py-2 rounded-full bg-[#102A71] text-white shadow-sm text-sm font-medium hover:opacity-90" @click="onSave" :disabled="isLoading">
                  <span v-if="isLoading">Saving...</span>
                  <span v-else>Save Changes</span>
                </button>
              </template>
            </div>
          </div>
        </template>
      </div>

      <div class="mt-6">
        <!-- Skeleton for sections -->
        <div v-if="initialLoading" class="space-y-6">
          <div class="bg-white shadow rounded-xl p-6 space-y-4">
            <div class="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div class="md:col-span-2 h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div class="bg-white shadow rounded-xl p-6 space-y-4">
            <div class="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div class="bg-white shadow rounded-xl p-6 space-y-4">
            <div class="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div class="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div v-else>
        <div class="space-y-6">
          <div class="bg-white shadow rounded-xl p-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-lg font-semibold text-gray-900">Personal Information</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-600 mb-1">First Name</label>
                <input v-model="form.firstName" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing" placeholder="First name" />
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1">Middle Name</label>
                <input v-model="form.middleName" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing" placeholder="Middle name" />
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1">Last Name</label>
                <input v-model="form.lastName" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing" placeholder="Last name" />
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1">Birthdate</label>
                <input v-model="form.birthdate" type="date" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm text-gray-600 mb-1">Address</label>
                <input v-model="form.address" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing" placeholder="City, Province" />
              </div>
            </div>
          </div>

          <div class="bg-white shadow rounded-xl p-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-lg font-semibold text-gray-900">School Details</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm text-gray-600 mb-1">Position</label>
                <input v-model="form.position" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing" placeholder="Position" />
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1">Department</label>
                <input v-model="form.department" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing" placeholder="Department" />
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1">Subject Handles</label>
                <input v-model="form.subjectHandles" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing" placeholder="e.g., Web Dev, Data Structures" />
              </div>
            </div>
          </div>

          <div class="bg-white shadow rounded-xl p-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-lg font-semibold text-gray-900">Contact Information</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-600 mb-1">Contact Number</label>
                <div class="flex items-center gap-2">
                  <input v-model="form.contactNumber" type="text" class="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing" placeholder="+63 9xx xxx xxxx" />
                </div>
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1">Email</label>
                <div class="flex items-center gap-2">
                  <input v-model="form.emailAddress" type="email" class="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing" placeholder="name@school.edu" />
                </div>
              </div>
            </div>
          </div>

        </div>
        <div class="mt-4 text-sm text-gray-500">Last Login: {{ form.lastLogin }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProfessorTopNav from '@/components/ProfessorTopNav.vue'
import api from '@/utils/api'

const router = useRouter()

// Toast helper (bottom-right, lightweight)
const showToast = (message, type = 'success', duration = 2800) => {
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

const initialLoading = ref(true)
const initialForm = {
  firstName: '',
  middleName: '',
  lastName: '',
  birthdate: '',
  address: '',
  position: '',
  department: '',
  subjectHandles: '',
  contactNumber: '',
  emailAddress: '',
  avatarUrl: '/profile.svg',
  coverUrl: '',
  lastLogin: ''
}

const form = ref(JSON.parse(JSON.stringify(initialForm)))
const snapshot = ref(JSON.parse(JSON.stringify(initialForm)))
const isEditing = ref(false)
const isLoading = ref(false)
const professorId = ref('')

const fullName = computed(() => `${form.value.firstName} ${form.value.middleName ? form.value.middleName + ' ' : ''}${form.value.lastName}`.trim())

// Get professor data from localStorage
const getProfessorData = () => {
  try {
    // Get the professor object from localStorage
    const professorData = localStorage.getItem('professor') || 
                          localStorage.getItem('user') || 
                          localStorage.getItem('currentUser')
    
    if (!professorData) {
      console.error('No professor data found in localStorage')
      showToast('Please log in to access your profile.', 'error')
      router.push('/auth/login')
      return null
    }

    // Parse the professor data
    const professor = JSON.parse(professorData)
    console.log('Professor data from localStorage:', professor)

    // Check if it's a professor and has an ID
    if (!professor.id) {
      console.error('Professor data does not contain an ID')
      showToast('Invalid user data. Please log in again.', 'error')
      router.push('/auth/login')
      return null
    }

    if (professor.role !== 'professor') {
      console.error('User is not a professor, role:', professor.role)
      showToast('Access denied. Professor account required.', 'error')
      router.push('/auth/login')
      return null
    }

    professorId.value = professor.id
    console.log('Professor ID found:', professorId.value)
    
    return professor
  } catch (error) {
    console.error('Error parsing professor data from localStorage:', error)
    showToast('Error reading user data. Please log in again.', 'error')
    router.push('/auth/login')
    return null
  }
}

// Fetch professor profile data
const fetchProfile = async () => {
  try {
    console.log('Fetching professor profile...')
    
    const professorData = getProfessorData()
    if (!professorData) return

    const id = professorData.id
    const response = await api.get(`/professors/${id}`)
    console.log('Profile response:', response.data)
    
    if (response.data.success) {
      const professor = response.data.professor
      console.log('Professor data received from API:', professor)
      
      // Format the last login date
      let lastLoginDisplay = 'Never logged in'
      if (professor.lastLogin) {
        const lastLoginDate = new Date(professor.lastLogin)
        const options = { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }
        lastLoginDisplay = lastLoginDate.toLocaleDateString('en-US', options)
        if (professor.lastLoginAgent) {
          lastLoginDisplay += ` (${professor.lastLoginAgent})`
        }
      }
      
      form.value = {
        firstName: professor.firstName || '',
        middleName: professor.middleName || '',
        lastName: professor.lastName || '',
        birthdate: professor.birthdate || '',
        address: professor.address || '',
        position: professor.position || '',
        department: professor.department || professor.postGraduate || '',
        subjectHandles: professor.subjectHandles || '',
        contactNumber: professor.contactNumber || '',
        emailAddress: professor.emailAddress || '',
        avatarUrl: professor.avatarUrl || '/profile.svg',
        coverUrl: professor.coverUrl || '',
        lastLogin: lastLoginDisplay
      }
      snapshot.value = JSON.parse(JSON.stringify(form.value))
    } else {
      console.error('Failed to fetch profile:', response.data.message)
      showToast('Failed to load profile: ' + response.data.message, 'error')
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
    
    if (error.response?.status === 404) {
      showToast('Professor profile not found. Please contact administrator.', 'error')
    } else {
      showToast('Error loading profile: ' + (error.response?.data?.message || error.message), 'error')
    }
  } finally {
    initialLoading.value = false
  }
}

const startEdit = () => {
  snapshot.value = JSON.parse(JSON.stringify(form.value))
  isEditing.value = true
}

const onReset = () => {
  form.value = JSON.parse(JSON.stringify(snapshot.value))
  isEditing.value = false
  showToast('Changes discarded', 'success')
}

const onSave = async () => {
  try {
    isLoading.value = true
    
    const professorData = getProfessorData()
    if (!professorData) return

    const id = professorData.id

    // Prepare update data
    const updateData = {
      firstName: form.value.firstName,
      middleName: form.value.middleName,
      lastName: form.value.lastName,
      birthdate: form.value.birthdate,
      address: form.value.address,
      position: form.value.position,
      department: form.value.department,
      subjectHandles: form.value.subjectHandles,
      contactNumber: form.value.contactNumber,
      emailAddress: form.value.emailAddress,
      avatarUrl: form.value.avatarUrl,
      coverUrl: form.value.coverUrl
    }

    console.log('Saving profile data for professor:', id, updateData)
    const response = await api.put(`/professors/${id}`, updateData)
    
    if (response.data.success) {
      // Update form with fresh data from server
      const updatedProfessor = response.data.professor
      
      // Format the last login date
      let lastLoginDisplay = 'Never logged in'
      if (updatedProfessor.lastLogin) {
        const lastLoginDate = new Date(updatedProfessor.lastLogin)
        const options = { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }
        lastLoginDisplay = lastLoginDate.toLocaleDateString('en-US', options)
        if (updatedProfessor.lastLoginAgent) {
          lastLoginDisplay += ` (${updatedProfessor.lastLoginAgent})`
        }
      }
      
      form.value.avatarUrl = updatedProfessor.avatarUrl || form.value.avatarUrl
      form.value.coverUrl = updatedProfessor.coverUrl || form.value.coverUrl
      form.value.lastLogin = lastLoginDisplay
      
      snapshot.value = JSON.parse(JSON.stringify(form.value))
      isEditing.value = false
      
      showToast('Profile updated successfully', 'success')
      console.log('Profile updated successfully')
    } else {
      throw new Error(response.data.message || 'Failed to update profile')
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile'
    showToast(errorMessage, 'error')
  } finally {
    isLoading.value = false
  }
}

const avatarInput = ref(null)
const triggerAvatarSelect = () => {
  avatarInput.value?.click()
}
const onAvatarSelected = (e) => {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  
  // Validate file type and size
  if (!file.type.startsWith('image/')) {
    showToast('Please select an image file', 'error')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    showToast('Image size should be less than 5MB', 'error')
    return
  }
  
  const reader = new FileReader()
  reader.onload = () => {
    form.value.avatarUrl = reader.result
  }
  reader.readAsDataURL(file)
}

const coverInput = ref(null)
const triggerCoverSelect = () => {
  coverInput.value?.click()
}
const onCoverSelected = (e) => {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  
  // Validate file type and size
  if (!file.type.startsWith('image/')) {
    showToast('Please select an image file', 'error')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    showToast('Image size should be less than 5MB', 'error')
    return
  }
  
  const reader = new FileReader()
  reader.onload = () => {
    form.value.coverUrl = reader.result
  }
  reader.readAsDataURL(file)
}

const goBack = () => {
  if (window.history.length > 1) router.back()
  else router.push('/professor/dashboard')
}

// Fetch profile on component mount
onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
.section-enter-active,
.section-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.section-enter-from,
.section-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.section-enter-to,
.section-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>