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
            <div class="text-base text-gray-900 font-semibold ">{{ form.email }}</div>
            <div class="text-sm text-gray-600 font-medium">{{ form.position }}</div>
          </div>
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
                <label class="block text-sm text-gray-600 mb-1">Post Graduate</label>
                <input v-model="form.postGraduate" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing" placeholder="Post Graduate" />
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
                  <input v-model="form.email" type="email" class="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed" :disabled="!isEditing" placeholder="name@school.edu" />
                </div>
              </div>
            </div>
          </div>

        </div>
        <div class="mt-4 text-sm text-gray-500">Last Login: {{ form.lastLogin }}</div>
      </div>
    </div>
  </div>
 </template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ProfessorTopNav from '@/components/ProfessorTopNav.vue'

const router = useRouter()

const initialForm = {
  firstName: 'Juan',
  middleName: '',
  lastName: 'Dela Cruz',
  birthdate: '',
  address: '',
  position: 'Instructor',
  postGraduate: '',
  subjectHandles: '',
  contactNumber: '+63 9xx xxx xxxx',
  email: 'prof@school.edu',
  avatarUrl: '/profile.svg',
  coverUrl: '',
  lastLogin: '26 Oct 2025, 08:07 PM (Chrome • Desktop)'
}

const form = ref(JSON.parse(JSON.stringify(initialForm)))
const snapshot = ref(JSON.parse(JSON.stringify(initialForm)))
const isEditing = ref(false)

const fullName = computed(() => `${form.value.firstName} ${form.value.middleName ? form.value.middleName + ' ' : ''}${form.value.lastName}`.trim())

const startEdit = () => {
  snapshot.value = JSON.parse(JSON.stringify(form.value))
  isEditing.value = true
}

const onReset = () => {
  form.value = JSON.parse(JSON.stringify(snapshot.value))
}

const onSave = () => {
  snapshot.value = JSON.parse(JSON.stringify(form.value))
  isEditing.value = false
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
