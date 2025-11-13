<template>
  <div class="bg-white min-h-screen pb-20 md:pb-8 p-4 md:p-4">
    <div class="px-4 md:px-6 pt-8">
      <div class="mb-4">
        <button @click="goBack" class="inline-flex items-center gap-2 text-sm font-medium text-gray-700 ">
          <iconify-icon icon="ion:chevron-back" class="text-base" />
          <span>Back</span>
        </button>
      </div>
      <h1 class="text-4xl font-semibold text-gray-900 ">Settings</h1>
      <p class="text-base text-gray-500 mb-6">Manage your account preferences, notifications, and security.</p>

      <!-- Change Password -->
      <section class="bg-white shadow rounded-xl p-5 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <label class="block text-sm text-gray-600 mb-1">Current Password</label>
            <input v-model="password.current" type="password" class="w-full border rounded-lg px-3 py-2 focus:outline-none " />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">New Password</label>
            <input v-model="password.new" type="password" class="w-full border rounded-lg px-3 py-2 focus:outline-none " />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Confirm New Password</label>
            <input v-model="password.confirm" type="password" class="w-full border rounded-lg px-3 py-2 focus:outline-none " />
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button @click="savePassword" class="px-4 py-2 rounded-lg bg-[#102A71] text-white hover:bg-[#102A71]/90">Update Password</button>
        </div>
        <p v-if="passwordMessage" class="text-sm mt-2" :class="passwordOk ? 'text-green-600' : 'text-red-600'">{{ passwordMessage }}</p>
      </section>

      <!-- Notifications -->
      <section class="bg-white shadow rounded-xl p-5 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Received Notification</h2>
        <div class="flex items-center justify-between mb-4">
          <div>
            <div class="text-sm font-medium text-gray-900">Notifications</div>
            <div class="text-xs text-gray-500">Turn on/off all notifications</div>
          </div>
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" v-model="notify.enabled" />
            <div class="w-11 h-6 bg-gray-400 rounded-full peer peer-checked:bg-[#102A71] transition-colors relative">
              <div class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform" :class="notify.enabled ? 'translate-x-5' : ''"></div>
            </div>
          </label>
        </div>
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="border rounded-lg p-4" :class="notify.enabled ? 'opacity-100' : 'opacity-50'">
            <div class="flex items-center justify-between mb-2">
              <div class="text-sm font-medium text-gray-900">Email</div>
              <input type="checkbox" v-model="notify.channels.email" :disabled="!notify.enabled" />
            </div>
            <div class="text-xs text-gray-500">Receive updates via email</div>
          </div>
          <div class="border rounded-lg p-4" :class="notify.enabled ? 'opacity-100' : 'opacity-50'">
            <div class="flex items-center justify-between mb-2">
              <div class="text-sm font-medium text-gray-900">SMS</div>
              <input type="checkbox" v-model="notify.channels.sms" :disabled="!notify.enabled" />
            </div>
            <div class="text-xs text-gray-500">Receive updates via SMS</div>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button @click="saveNotifications" class="px-4 py-2 rounded-lg bg-[#102A71] text-white hover:bg-[#102A71]/90">Save Preferences</button>
        </div>
      </section>

      <!-- Login & Security -->
      <section class="bg-white shadow rounded-xl p-5">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Login & Security</h2>
        <div class="space-y-5">
          <!-- Two-Factor Auth -->
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-900">Two-Factor Authentication</div>
              <div class="text-xs text-gray-500">Add an extra layer of security to your account</div>
            </div>
            <label class="inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer" v-model="security.twoFA" />
              <div class="w-11 h-6 bg-gray-400 rounded-full peer peer-checked:bg-[#102A71] transition-colors relative">
                <div class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform" :class="security.twoFA ? 'translate-x-5' : ''"></div>
              </div>
            </label>
          </div>

          <!-- OTP channels -->
          <div class="grid sm:grid-cols-2 gap-4" v-if="security.twoFA">
            <label class="border rounded-lg p-4 flex items-center gap-3 cursor-pointer">
              <input type="radio" value="email" v-model="security.otpChannel" />
              <div>
                <div class="text-sm font-medium text-gray-900">OTP via Email</div>
                <div class="text-xs text-gray-500">Send codes to your registered email</div>
              </div>
            </label>
            <label class="border rounded-lg p-4 flex items-center gap-3 cursor-pointer">
              <input type="radio" value="sms" v-model="security.otpChannel" />
              <div>
                <div class="text-sm font-medium text-gray-900">OTP via SMS</div>
                <div class="text-xs text-gray-500">Send codes to your phone number</div>
              </div>
            </label>
          </div>

          <!-- Active sessions -->
          <div class="border rounded-xl">
            <div class="bg-gray-100 px-4 py-3  text-sm font-medium text-gray-900">Active Sessions / Devices</div>
            <ul>
              <li v-for="(s, i) in sessions" :key="i" class="flex items-center justify-between px-4 py-3 border-t text-sm">
                <div>
                  <div class="text-gray-900">{{ s.device }} — {{ s.location }}</div>
                  <div class="text-xs text-gray-500">{{ s.lastActive }}</div>
                </div>
                <button class="text-xs text-red-600 hover:underline" @click="signOutSession(i)">Sign out</button>
              </li>
            </ul>
          </div>

          <div class="flex justify-end">
            <button class="px-4 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-200 mr-2" @click="signOutAll">Sign out of all devices</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => {
  router.back()
}

// Change Password
const password = ref({ current: '', new: '', confirm: '' })
const passwordMessage = ref('')
const passwordOk = ref(false)
const savePassword = () => {
  if (!password.value.current || !password.value.new || !password.value.confirm) {
    passwordOk.value = false
    passwordMessage.value = 'Please complete all fields.'
    return
  }
  if (password.value.new !== password.value.confirm) {
    passwordOk.value = false
    passwordMessage.value = 'New passwords do not match.'
    return
  }
  // Simulate success
  passwordOk.value = true
  passwordMessage.value = 'Password updated successfully.'
}

// Notifications
const notify = ref({ enabled: true, channels: { email: true, sms: false } })
const saveNotifications = () => {
  console.log('Saved notification prefs', notify.value)
}

// Login & Security
const security = ref({ twoFA: false, otpChannel: 'email' })
const sessions = ref([
  { device: 'Chrome on Windows', location: 'Manila, PH', lastActive: 'Active now' },
  { device: 'iPhone 13', location: 'Quezon City, PH', lastActive: '2 hours ago' },
])
const signOutSession = (index) => {
  sessions.value.splice(index, 1)
}
const signOutAll = () => {
  sessions.value = []
}
</script>
