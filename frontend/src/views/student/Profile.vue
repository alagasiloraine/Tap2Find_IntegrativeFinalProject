<template>
  <div class="bg-white min-h-screen pb-20 md:pb-8 p-4 md:p-4">
    <StudentTopNav />

    <div class="px-4 md:px-6 pt-8">
      <div class="mb-4">
        <button @click="goBack" class="inline-flex items-center gap-2 text-sm font-medium text-gray-700 ">
          <iconify-icon icon="ion:chevron-back" class="text-base" />
          <span>Back</span>
        </button>
      </div>
      <div class="bg-white shadow rounded-xl p-6">
        <div class="relative rounded-xl overflow-hidden h-40 md:h-56">
          <img v-if="form.coverUrl" :key="form.coverUrl" :src="form.coverUrl" alt="Cover" class="w-full h-full object-cover" />
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
            <img v-if="form.avatarUrl" :key="form.avatarUrl" :src="form.avatarUrl" alt="Profile" class="h-full w-full object-cover" />
            <img v-else src="/profile.svg" alt="Profile placeholder" class="h-full w-full object-cover" />
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
          <p v-if="isEditing" class="mt-2 text-xs text-gray-500">Profile and Cover photo: Max 10 MB • JPG, PNG, or WebP</p>
          <div class="mt-2 flex items-center justify-center gap-2">
            <h2 class="text-2xl font-bold text-gray-900">{{ fullName }}</h2>
            <iconify-icon icon="lucide:badge-check" class="text-green-500" />
          </div>
          <div class="text-base text-gray-900 font-semibold ">{{ form.program }} | {{ form.yearLevel }} | {{ form.section }}</div>
          <div class="text-base text-gray-600 font-medium">{{ displayId }}</div>
          <div class="mt-4 flex items-center justify-center gap-3">
            <button v-if="!isEditing" class="px-4 py-2 rounded-full bg-[#F5C400] text-white shadow-sm text-sm font-medium hover:opacity-90" @click="startEdit">Edit Profile</button>
            <template v-else>
              <button class="px-4 py-2 rounded-full border border-gray-300 shadow-sm text-sm font-medium hover:bg-gray-50" @click="onReset">Reset</button>
              <button class="px-4 py-2 rounded-full bg-[#102A71] text-white shadow-sm text-sm font-medium hover:opacity-90" @click="onSave">Save Changes</button>
            </template>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <div class="bg-white shadow rounded-xl p-6 space-y-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">First Name</label>
              <input v-model="form.firstName" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing" placeholder="First name" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Last Name</label>
              <input v-model="form.lastName" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing" placeholder="Last name" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Middle Name (Optional)</label>
              <input v-model="form.middleName" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing" placeholder="Middle name" />
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

          <hr class="my-2" />

          <h3 class="text-lg font-semibold text-gray-900 mb-2">School Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">ID Number</label>
              <input v-model="form.idNumber" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Course / Program</label>
              <select v-model="form.program" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing">
                <option v-for="p in programs" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Year Level</label>
              <select v-model="form.yearLevel" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing">
                <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Section</label>
              <select v-model="form.section" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing">
                <option v-for="s in sections" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
          </div>

          <hr class="my-2" />

          <h3 class="text-lg font-semibold text-gray-900 mb-2">Contact Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Contact Number</label>
              <div class="flex items-center gap-2">
                <input v-model="form.contactNumber" type="text" class="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing" placeholder="+63 9xx xxx xxxx">
              </div>
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Email</label>
              <div class="flex items-center gap-2">
                <input v-model="form.email" type="email" class="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing" placeholder="name@school.edu">
                <span class="text-xs" :class="form.emailVerified ? 'text-green-600' : 'text-gray-500'">Status: {{ form.emailVerified ? 'Verified' : 'Unverified' }}</span>
              </div>
            </div>
          </div>

          <hr class="my-2" />

          <h3 class="text-lg font-semibold text-gray-900 mb-2">RFID & Access</h3>
          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">RFID / Card UID</span>
              <span class="text-sm font-medium">{{ form.rfidUid }}</span>
            </div>
            <div>
              <button class="px-3 py-2 text-white rounded-full text-sm bg-[#F5C400] disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing" @click="onBindCard">Bind New Card</button>
            </div>
          </div>

          <hr class="my-2" />

          <h3 class="text-lg font-semibold text-gray-900 mb-2">Notification Preferences</h3>
          <div class="space-y-3 text-sm">
            <label class="flex items-center gap-2"><input type="checkbox" v-model="form.notify.professorReplies" class="h-4 w-4" :disabled="!isEditing" /> Professor Replies</label>
            <label class="flex items-center gap-2"><input type="checkbox" v-model="form.notify.inquiryUpdates" class="h-4 w-4" :disabled="!isEditing" /> Inquiry Updates</label>
            <label class="flex items-center gap-2"><input type="checkbox" v-model="form.notify.systemAlerts" class="h-4 w-4" :disabled="!isEditing" /> System Alerts</label>
          </div>

          <hr class="my-2" />

          <h3 class="text-lg font-semibold text-gray-900 mb-2">Account & Security</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm text-gray-600 mb-1">Username</label>
              <input v-model="form.username" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Current Password</label>
              <input v-model="form.currentPassword" type="password" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">New Password</label>
              <input v-model="form.newPassword" type="password" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Confirm Password</label>
              <input v-model="form.confirmPassword" type="password" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing" />
            </div>
            <div class="md:col-span-2 text-sm text-gray-500">Last Login: {{ lastLoginDisplay }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StudentTopNav from '@/components/StudentTopNav.vue'

const router = useRouter()
const programs = ['BSIT', 'BSCS', 'BSCpE']
const years = ['1st Year', '2nd Year', '3rd Year', '4th Year']
const sections = ['F1', 'F2', 'F3', 'F4','F5', 'F6', 'F7']
const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // 10 MB

const initialForm = {
  firstName: '',
  lastName: '',
  middleName: '',
  birthdate: '',
  address: '',
  idNumber: '',
  program: '',
  yearLevel: '',
  section: '',
  contactNumber: '+63 9xx xxx xxxx',
  contactVerified: true,
  email: '',
  emailVerified: true,
  rfidUid: '04:A1:C3:..',
  avatarUrl: '',
  coverUrl: '',
  notify: {
    professorReplies: true,
    inquiryUpdates: true,
    systemAlerts: true
  },
  username: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  lastLogin: '26 Oct 2025, 08:07 PM (Chrome • Desktop)',
  lastLoginAgent: ''
}

const form = ref(JSON.parse(JSON.stringify(initialForm)))
const snapshot = ref(JSON.parse(JSON.stringify(initialForm)))
const isEditing = ref(false)
const isSaving = ref(false)

// Toast helper (top-center, smooth slide/fade, spinner + progress bar)
const showToast = (message, type = 'success', duration = 2500) => {
  // container at top-center (reuse if present)
  let container = document.getElementById('t2f-toast-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 't2f-toast-container'
    container.style.position = 'fixed'
    container.style.top = '16px'
    container.style.right = '16px'
    container.style.transform = 'none'
    container.style.zIndex = '9999'
    container.style.display = 'flex'
    container.style.flexDirection = 'column'
    container.style.gap = '8px'
    document.body.appendChild(container)
  }

  const toast = document.createElement('div')
  toast.style.minWidth = '260px'
  toast.style.maxWidth = '420px'
  toast.style.background = type === 'success' ? '#ECFDF5' : '#FEF2F2' // emerald-50 / red-50
  toast.style.border = `1px solid ${type === 'success' ? '#34D399' : '#F87171'}` // emerald-400 / red-400
  toast.style.color = '#111827'
  toast.style.borderRadius = '12px'
  toast.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)'
  toast.style.overflow = 'hidden'
  toast.style.opacity = '0'
  toast.style.transform = 'translateY(-12px)'
  toast.style.transition = 'opacity 220ms ease, transform 220ms ease'

  // content row with spinner and message
  const row = document.createElement('div')
  row.style.display = 'flex'
  row.style.alignItems = 'center'
  row.style.gap = '10px'
  row.style.padding = '10px 14px'

  // SVG spinner that rotates via animateTransform (no CSS keyframes needed)
  const spinner = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  spinner.setAttribute('viewBox', '0 0 24 24')
  spinner.setAttribute('width', '18')
  spinner.setAttribute('height', '18')
  spinner.innerHTML = `
    <circle cx="12" cy="12" r="9" stroke="${type === 'success' ? '#10B981' : '#EF4444'}" stroke-width="3" fill="none" opacity="0.25"/>
    <path d="M21 12a9 9 0 0 0-9-9" stroke="${type === 'success' ? '#10B981' : '#EF4444'}" stroke-width="3" fill="none" stroke-linecap="round">
      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.9s" repeatCount="indefinite" />
    </path>
  `

  const text = document.createElement('div')
  text.textContent = message
  text.style.fontSize = '14px'
  text.style.fontWeight = '600'

  row.appendChild(spinner)
  row.appendChild(text)

  // progress bar (indicates remaining time)
  const barWrap = document.createElement('div')
  barWrap.style.height = '3px'
  barWrap.style.background = 'transparent'
  barWrap.style.width = '100%'
  const bar = document.createElement('div')
  bar.style.height = '100%'
  bar.style.width = '100%'
  bar.style.background = type === 'success' ? '#6EE7B7' : '#FCA5A5' // emerald-300 / red-300
  bar.style.transition = `width ${duration}ms linear`
  barWrap.appendChild(bar)

  toast.appendChild(row)
  toast.appendChild(barWrap)
  container.appendChild(toast)

  // enter
  requestAnimationFrame(() => {
    toast.style.opacity = '1'
    toast.style.transform = 'translateY(0)'
    // start progress
    requestAnimationFrame(() => (bar.style.width = '0%'))
  })

  // exit
  setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transform = 'translateY(-8px)'
    setTimeout(() => {
      toast.remove()
      if (!container.childElementCount) container.remove()
    }, 240)
  }, duration)
}

const lastLoginDisplay = computed(() => {
  const iso = form.value.lastLogin
  const agent = form.value.lastLoginAgent || ''
  // If it's already a pretty string (not ISO), just return it
  if (iso && /\d{1,2} \w{3} \d{4}/.test(String(iso))) return String(iso)
  try {
    if (!iso) return ''
    const d = new Date(iso)
    if (isNaN(d.getTime())) return String(iso)
    const options = { day: '2-digit', month: 'short', year: 'numeric' }
    const datePart = d.toLocaleDateString(undefined, options).replace(',', '')
    let hours = d.getHours()
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    if (hours === 0) hours = 12
    const timePart = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`
    const agentPart = agent ? ` (${agent})` : ''
    return `${datePart}, ${timePart}${agentPart}`
  } catch {
    return String(iso)
  }
})

const fullName = computed(() => {
  const parts = [form.value.firstName, form.value.middleName, form.value.lastName]
  return parts.filter(Boolean).join(' ').trim()
})
const displayId = computed(() => {
  const raw = String(form.value.idNumber || '').trim()
  if (!raw) return ''
  const upper = raw.toUpperCase()
  if (upper.startsWith('MCC-')) return upper
  if (upper.startsWith('MCC')) {
    const rest = upper.slice(3).replace(/^[-\s]*/, '')
    return `MCC-${rest}`
  }
  return `MCC-${upper}`
})

const startEdit = () => {
  snapshot.value = JSON.parse(JSON.stringify(form.value))
  isEditing.value = true
}

const onReset = () => {
  form.value = JSON.parse(JSON.stringify(snapshot.value))
  if (avatarInput.value) avatarInput.value.value = ''
  if (coverInput.value) coverInput.value.value = ''
  isEditing.value = false
  showToast('Changes discarded', 'success')
}

import api from '@/utils/api'

const onSave = async () => {
  if (isSaving.value) return
  isSaving.value = true
  try {
    const token = localStorage.getItem('token')
    // Basic validation for Account & Security section
    const hasAnyPassword = Boolean(
      (form.value.currentPassword || '').trim() ||
      (form.value.newPassword || '').trim() ||
      (form.value.confirmPassword || '').trim()
    )

    if (hasAnyPassword) {
      if (!form.value.currentPassword || !form.value.newPassword || !form.value.confirmPassword) {
        showToast('Please fill Current, New, and Confirm Password to change password', 'error')
        return
      }
      if (form.value.newPassword !== form.value.confirmPassword) {
        showToast('New password and Confirm password do not match', 'error')
        return
      }
      if (String(form.value.newPassword).length < 8) {
        showToast('New password must be at least 8 characters', 'error')
        return
      }
    }
    const payload = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      middleName: form.value.middleName,
      birthdate: form.value.birthdate,
      address: form.value.address,
      idNumber: form.value.idNumber,
      contactNumber: form.value.contactNumber,
      program: form.value.program,
      yearLevel: form.value.yearLevel,
      section: form.value.section,
      emailAddress: form.value.email,
      avatarUrl: form.value.avatarUrl,
      coverUrl: form.value.coverUrl,
      // Account & Security
      username: form.value.username || undefined,
      currentPassword: hasAnyPassword ? form.value.currentPassword : undefined,
      newPassword: hasAnyPassword ? form.value.newPassword : undefined,
    }
    const res = await api.put('/auth/profile', payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.data?.success && res.data.user) {
      const prev = (() => { try { return JSON.parse(localStorage.getItem('user')||'{}') } catch { return {} } })()
      const merged = { ...prev, ...res.data.user }
      // never lose existing avatar/cover if backend returns empty/undefined
      if (!res.data.user.avatarUrl && prev.avatarUrl) merged.avatarUrl = prev.avatarUrl
      if (!res.data.user.coverUrl && prev.coverUrl) merged.coverUrl = prev.coverUrl
      if (res.data.user.username || form.value.username) {
        merged.username = res.data.user.username || form.value.username
      }
      localStorage.setItem('user', JSON.stringify(merged))
      // Clear sensitive password inputs after success
      form.value.currentPassword = ''
      form.value.newPassword = ''
      form.value.confirmPassword = ''
      snapshot.value = JSON.parse(JSON.stringify(form.value))
      isEditing.value = false
      showToast('Profile updated successfully', 'success')
    }
  } catch (e) {
    showToast(e?.response?.data?.message || 'Failed to update profile', 'error')
  } finally {
    isSaving.value = false
  }
}

const onBindCard = () => {
  if (!isEditing.value) return
  // Placeholder: generate a mock UID
  const rand = Math.random().toString(16).slice(2, 8).toUpperCase()
  form.value.rfidUid = `04:${rand.slice(0,2)}:${rand.slice(2,4)}:${rand.slice(4,6)}`
}

const avatarInput = ref(null)
const triggerAvatarSelect = () => {
  avatarInput.value?.click()
}
const onAvatarSelected = (e) => {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  if (file.size > MAX_IMAGE_BYTES) {
    showToast('Profile photo exceeds 2 MB limit', 'error')
    e.target.value = ''
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
  if (file.size > MAX_IMAGE_BYTES) {
    showToast('Cover photo exceeds 2 MB limit', 'error')
    e.target.value = ''
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
  else router.push('/')
}

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (!storedUser) return
  try {
    const u = JSON.parse(storedUser)
    if (u.firstName) form.value.firstName = u.firstName
    if (u.middleName) form.value.middleName = u.middleName
    if (u.lastName) form.value.lastName = u.lastName
    if (u.birthdate) form.value.birthdate = u.birthdate
    if (u.address) form.value.address = u.address
    if (u.emailAddress) form.value.email = u.emailAddress
    if (u.idNumber) form.value.idNumber = u.idNumber
    if (u.program) form.value.program = u.program
    if (u.yearLevel) form.value.yearLevel = u.yearLevel
    if (u.section) form.value.section = u.section
    if (u.contactNumber) form.value.contactNumber = u.contactNumber
    if (u.avatarUrl) form.value.avatarUrl = u.avatarUrl
    if (u.coverUrl) form.value.coverUrl = u.coverUrl
    if (u.lastLogin) form.value.lastLogin = u.lastLogin
    if (u.lastLoginAgent) form.value.lastLoginAgent = u.lastLoginAgent
    // Derive username from logged-in user's names (always override placeholder)
    const fn = (u.firstName || '').toString().trim().toLowerCase().replace(/\s+/g, '')
    const ln = (u.lastName || '').toString().trim().toLowerCase().replace(/\s+/g, '')
    const dot = fn && ln ? '.' : ''
    const derived = `${fn}${dot}${ln}`
    if (derived) form.value.username = derived
    // Populate contact number if provided in stored user
    // Ensure select options include user's values
    if (u.program && !programs.includes(u.program)) programs.push(u.program)
    if (u.yearLevel && !years.includes(u.yearLevel)) years.push(u.yearLevel)
    if (u.section && !sections.includes(u.section)) sections.push(u.section)
  } catch (_) {
    /* noop */
  }
  // Always fetch fresh user from backend to avoid stale localStorage
  const token = localStorage.getItem('token')
  if (token) {
    api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (res.data?.success && res.data.user) {
          // merge to avoid dropping client-side fields if backend omits them
          const prev = (() => { try { return JSON.parse(localStorage.getItem('user')||'{}') } catch { return {} } })()
          const merged = { ...prev, ...res.data.user }
          if (!res.data.user.avatarUrl && prev.avatarUrl) merged.avatarUrl = prev.avatarUrl
          if (!res.data.user.coverUrl && prev.coverUrl) merged.coverUrl = prev.coverUrl
          localStorage.setItem('user', JSON.stringify(merged))
          const u = merged
          if (u.firstName) form.value.firstName = u.firstName
          if (u.middleName) form.value.middleName = u.middleName
          if (u.lastName) form.value.lastName = u.lastName
          if (u.birthdate) form.value.birthdate = u.birthdate
          if (u.address) form.value.address = u.address
          if (u.emailAddress) form.value.email = u.emailAddress
          if (u.idNumber) form.value.idNumber = u.idNumber
          if (u.program) form.value.program = u.program
          if (u.yearLevel) form.value.yearLevel = u.yearLevel
          if (u.section) form.value.section = u.section
          if (u.contactNumber) form.value.contactNumber = u.contactNumber
          if (u.avatarUrl) form.value.avatarUrl = u.avatarUrl
          if (u.coverUrl) form.value.coverUrl = u.coverUrl
        if (u.lastLogin) form.value.lastLogin = u.lastLogin
        if (u.lastLoginAgent) form.value.lastLoginAgent = u.lastLoginAgent
          if (u.program && !programs.includes(u.program)) programs.push(u.program)
          if (u.yearLevel && !years.includes(u.yearLevel)) years.push(u.yearLevel)
          if (u.section && !sections.includes(u.section)) sections.push(u.section)
        }
      })
      .catch(() => {})
  }
})
</script>

