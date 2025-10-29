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
          <div class="mt-2 flex items-center justify-center gap-2">
            <h2 class="text-2xl font-bold text-gray-900">{{ fullName }}</h2>
            <iconify-icon icon="lucide:badge-check" class="text-green-500" />
          </div>
          <div class="text-base text-gray-900 font-semibold ">{{ form.program }} | {{ form.yearLevel }} | {{ form.section }}</div>
          <div class="text-base text-gray-600 font-medium">MCC-{{ form.idNumber }}</div>
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
              <label class="block text-sm text-gray-600 mb-1">Middle Name</label>
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
                <input v-model="form.contactNumber" type="text" class="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing" placeholder="+63 9xx xxx xxxx" />
                <span class="text-xs" :class="form.contactVerified ? 'text-green-600' : 'text-gray-500'">Status: {{ form.contactVerified ? 'Verified' : 'Unverified' }}</span>
              </div>
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Email</label>
              <div class="flex items-center gap-2">
                <input v-model="form.email" type="email" class="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing" placeholder="name@school.edu" />
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
            <div class="md:col-span-2 text-sm text-gray-500">Last Login: {{ form.lastLogin }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import StudentTopNav from '@/components/StudentTopNav.vue'

const router = useRouter()
const programs = ['BSIT', 'BSCS', 'BSECE']
const years = ['1st Year', '2nd Year', '3rd Year', '4th Year']
const sections = ['F1', 'F2', 'A1', 'B1']

const initialForm = {
  firstName: 'Loraine',
  lastName: 'Alagasi',
  middleName: '',
  birthdate: '',
  address: '',
  idNumber: '2025-12345',
  program: 'BSIT',
  yearLevel: '4th Year',
  section: 'F1',
  contactNumber: '+63 9xx xxx xxxx',
  contactVerified: true,
  email: 'name@school.edu',
  emailVerified: true,
  rfidUid: '04:A1:C3:..',
  avatarUrl: '/profile.svg',
  coverUrl: '',
  notify: {
    professorReplies: true,
    inquiryUpdates: true,
    systemAlerts: true
  },
  username: 'loraine.alagasi',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  lastLogin: '26 Oct 2025, 08:07 PM (Chrome • Desktop)'
}

const form = ref(JSON.parse(JSON.stringify(initialForm)))
const snapshot = ref(JSON.parse(JSON.stringify(initialForm)))
const isEditing = ref(false)

const fullName = computed(() => `${form.value.firstName} ${form.value.lastName}`.trim())

const startEdit = () => {
  snapshot.value = JSON.parse(JSON.stringify(form.value))
  isEditing.value = true
}

const onReset = () => {
  form.value = JSON.parse(JSON.stringify(snapshot.value))
}

const onSave = () => {
  // Here you can call an API to persist form.value
  snapshot.value = JSON.parse(JSON.stringify(form.value))
  isEditing.value = false
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
</script>

