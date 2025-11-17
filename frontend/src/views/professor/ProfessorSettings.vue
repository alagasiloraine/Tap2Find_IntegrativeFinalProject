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
          <button @click="savePassword" :disabled="loading.password" class="px-4 py-2 rounded-lg bg-[#102A71] text-white hover:bg-[#102A71]/90 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ loading.password ? 'Updating...' : 'Update Password' }}
          </button>
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
            <div class="text-xs text-gray-400 mt-1">{{ userData.emailAddress }}</div>
          </div>
          <div class="border rounded-lg p-4" :class="notify.enabled ? 'opacity-100' : 'opacity-50'">
            <div class="flex items-center justify-between mb-2">
              <div class="text-sm font-medium text-gray-900">SMS</div>
              <input type="checkbox" v-model="notify.channels.sms" :disabled="!notify.enabled" />
            </div>
            <div class="text-xs text-gray-500">Receive updates via SMS</div>
            <div class="text-xs text-gray-400 mt-1">{{ userData.contactNumber || 'No phone number set' }}</div>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button @click="saveNotifications" :disabled="loading.notifications" class="px-4 py-2 rounded-lg bg-[#102A71] text-white hover:bg-[#102A71]/90 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ loading.notifications ? 'Saving...' : 'Save Preferences' }}
          </button>
        </div>
        <p v-if="notificationMessage" class="text-sm mt-2" :class="notificationOk ? 'text-green-600' : 'text-red-600'">{{ notificationMessage }}</p>
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
                <div class="text-xs text-gray-400 mt-1">{{ userData.emailAddress }}</div>
              </div>
            </label>
            <label class="border rounded-lg p-4 flex items-center gap-3 cursor-pointer">
              <input type="radio" value="sms" v-model="security.otpChannel" />
              <div>
                <div class="text-sm font-medium text-gray-900">OTP via SMS</div>
                <div class="text-xs text-gray-500">Send codes to your phone number</div>
                <div class="text-xs text-gray-400 mt-1">{{ userData.contactNumber || 'No phone number set' }}</div>
              </div>
            </label>
          </div>

          <!-- Active sessions -->
          <div class="border rounded-xl">
            <div class="bg-gray-100 px-4 py-3 text-sm font-medium text-gray-900 flex justify-between items-center">
              <span>Active Sessions / Devices</span>
              <button 
                @click="loadSessions" 
                class="text-xs text-blue-600 hover:text-blue-800"
                :disabled="loading.sessions"
              >
                {{ loading.sessions ? 'Refreshing...' : 'Refresh' }}
              </button>
            </div>
            <div v-if="loading.sessions" class="p-4 text-center">
              <div class="text-sm text-gray-500">Loading sessions...</div>
            </div>
            <ul v-else-if="sessions.length > 0">
              <li v-for="session in sessions" :key="session.id" class="flex items-center justify-between px-4 py-3 border-t text-sm">
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="text-gray-900 font-medium">{{ session.device }}</span>
                    <span v-if="session.isCurrent" class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Current
                    </span>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    {{ session.location }} • {{ session.ipAddress }}
                  </div>
                  <div class="text-xs text-gray-400 mt-1">
                    Last active: {{ formatRelativeTime(session.lastActive) }}
                  </div>
                </div>
                <button 
                  v-if="!session.isCurrent"
                  @click="signOutSession(session.id)" 
                  class="text-xs text-red-600 hover:text-red-800 hover:underline ml-4"
                  :disabled="loading.sessionSignOut"
                >
                  Sign out
                </button>
                <span v-else class="text-xs text-gray-400 ml-4">Current session</span>
              </li>
            </ul>
            <div v-else class="p-4 text-center">
              <div class="text-sm text-gray-500">No active sessions found</div>
            </div>
          </div>

          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-600">
              {{ sessions.length }} active session{{ sessions.length !== 1 ? 's' : '' }}
            </div>
            <div class="flex gap-2">
              <button 
                @click="signOutAll" 
                :disabled="loading.signOutAll || sessions.length <= 1"
                class="px-4 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loading.signOutAll ? 'Signing out...' : 'Sign out all devices' }}
              </button>
              <button 
                @click="saveSecuritySettings" 
                :disabled="loading.security" 
                class="px-4 py-2 rounded-lg bg-[#102A71] text-white hover:bg-[#102A71]/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loading.security ? 'Saving...' : 'Save Security Settings' }}
              </button>
            </div>
          </div>
          <p v-if="securityMessage" class="text-sm mt-2 text-right" :class="securityOk ? 'text-green-600' : 'text-red-600'">{{ securityMessage }}</p>
          <p v-if="sessionMessage" class="text-sm mt-2 text-right" :class="sessionOk ? 'text-green-600' : 'text-red-600'">{{ sessionMessage }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from "@/utils/api"

const router = useRouter()

// Get current user data from localStorage
const getUserData = () => {
  try {
    const userData = localStorage.getItem('user')
    if (userData) {
      return JSON.parse(userData)
    }
    return null
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error)
    return null
  }
}

// Reactive user data
const userData = reactive({
  id: '',
  emailAddress: '',
  contactNumber: '',
  firstName: '',
  lastName: '',
  role: ''
})

const goBack = () => {
  router.back()
}

// Loading states
const loading = ref({
  password: false,
  notifications: false,
  security: false,
  sessions: false,
  sessionSignOut: false,
  signOutAll: false
})

// Change Password
const password = ref({ current: '', new: '', confirm: '' })
const passwordMessage = ref('')
const passwordOk = ref(false)

const savePassword = async () => {
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

  if (password.value.new.length < 6) {
    passwordOk.value = false
    passwordMessage.value = 'New password must be at least 6 characters long.'
    return
  }

  loading.value.password = true
  passwordMessage.value = ''

  try {
    const user = getUserData()
    if (!user || !user.id) {
      throw new Error('User not authenticated. Please log in again.')
    }

    console.log('🔄 Changing password for user:', user.id)

    const response = await api.post(`/user-settings/${user.id}/password/change`, {
      currentPassword: password.value.current,
      newPassword: password.value.new
    })

    if (response.data.success) {
      passwordOk.value = true
      passwordMessage.value = response.data.message
      password.value = { current: '', new: '', confirm: '' }
    } else {
      throw new Error(response.data.message)
    }
  } catch (error) {
    passwordOk.value = false
    passwordMessage.value = error.response?.data?.message || error.message || 'Failed to update password'
    console.error('❌ Password change error:', error)
  } finally {
    loading.value.password = false
  }
}

// Notifications
const notify = ref({ enabled: true, channels: { email: true, sms: false } })
const notificationMessage = ref('')
const notificationOk = ref(false)

const loadNotificationPreferences = async () => {
  try {
    const user = getUserData()
    if (!user || !user.id) {
      console.warn('No user data found for loading notifications')
      return
    }

    console.log('🔄 Loading notification preferences for user:', user.id)

    const response = await api.get(`/user-settings/${user.id}/notifications`)
    
    if (response.data.success) {
      notify.value = response.data.data.preferences
      console.log('✅ Loaded notification preferences:', notify.value)
    }
  } catch (error) {
    console.error('❌ Failed to load notification preferences:', error)
  }
}

const saveNotifications = async () => {
  loading.value.notifications = true
  notificationMessage.value = ''

  try {
    const user = getUserData()
    if (!user || !user.id) {
      throw new Error('User not authenticated. Please log in again.')
    }

    console.log('🔄 Saving notification preferences for user:', user.id)

    const response = await api.put(`/user-settings/${user.id}/notifications`, {
      preferences: notify.value
    })

    if (response.data.success) {
      notificationOk.value = true
      notificationMessage.value = response.data.message
      console.log('✅ Notification preferences saved')
    } else {
      throw new Error(response.data.message)
    }
  } catch (error) {
    notificationOk.value = false
    notificationMessage.value = error.response?.data?.message || error.message || 'Failed to save notification preferences'
    console.error('❌ Save notification preferences error:', error)
  } finally {
    loading.value.notifications = false
  }
}

// Login & Security
const security = ref({ twoFA: false, otpChannel: 'email' })
const securityMessage = ref('')
const securityOk = ref(false)

// Load security settings
const loadSecuritySettings = async () => {
  try {
    const user = getUserData()
    if (!user || !user.id) {
      console.warn('No user data found for loading security settings')
      return
    }

    console.log('🔄 Loading security settings for user:', user.id)

    const response = await api.get(`/user-settings/${user.id}/security`)
    
    if (response.data.success) {
      security.value = response.data.data
      console.log('✅ Loaded security settings:', security.value)
    }
  } catch (error) {
    console.error('❌ Failed to load security settings:', error)
  }
}

const saveSecuritySettings = async () => {
  loading.value.security = true
  securityMessage.value = ''

  try {
    const user = getUserData()
    if (!user || !user.id) {
      throw new Error('User not authenticated. Please log in again.')
    }

    console.log('🔄 Saving security settings for user:', user.id)

    // Validate SMS channel if selected
    if (security.value.twoFA && security.value.otpChannel === 'sms' && !userData.contactNumber) {
      securityOk.value = false
      securityMessage.value = 'Phone number is required for SMS notifications. Please update your profile first.'
      return
    }

    const response = await api.put(`/user-settings/${user.id}/security`, {
      twoFA: security.value.twoFA,
      otpChannel: security.value.otpChannel
    })

    if (response.data.success) {
      securityOk.value = true
      securityMessage.value = response.data.message
      console.log('✅ Security settings saved')
    } else {
      throw new Error(response.data.message)
    }
  } catch (error) {
    securityOk.value = false
    securityMessage.value = error.response?.data?.message || error.message || 'Failed to save security settings'
    console.error('❌ Save security settings error:', error)
  } finally {
    loading.value.security = false
  }
}

// Sessions management
const sessions = ref([])
const sessionMessage = ref('')
const sessionOk = ref(false)

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  
  return date.toLocaleDateString()
}

const loadSessions = async () => {
  try {
    const user = getUserData()
    if (!user || !user.id) {
      console.warn('No user data found for loading sessions')
      return
    }

    loading.value.sessions = true
    console.log('🔄 Loading active sessions for user:', user.id)

    const response = await api.get(`/user-settings/${user.id}/sessions`)
    
    if (response.data.success) {
      sessions.value = response.data.data.sessions
      console.log('✅ Loaded sessions:', sessions.value.length)
    } else {
      throw new Error(response.data.message)
    }
  } catch (error) {
    console.error('❌ Failed to load sessions:', error)
    sessionMessage.value = error.response?.data?.message || 'Failed to load sessions'
    sessionOk.value = false
  } finally {
    loading.value.sessions = false
  }
}

const signOutSession = async (sessionId) => {
  try {
    const user = getUserData()
    if (!user || !user.id) {
      throw new Error('User not authenticated')
    }

    loading.value.sessionSignOut = true
    console.log('🔄 Signing out session:', sessionId)

    const response = await api.delete(`/user-settings/${user.id}/sessions/${sessionId}`)

    if (response.data.success) {
      sessionMessage.value = response.data.message
      sessionOk.value = true
      sessions.value = sessions.value.filter(s => s.id !== sessionId)
      console.log('✅ Session signed out')
    } else {
      throw new Error(response.data.message)
    }
  } catch (error) {
    console.error('❌ Failed to sign out session:', error)
    sessionMessage.value = error.response?.data?.message || 'Failed to sign out session'
    sessionOk.value = false
  } finally {
    loading.value.sessionSignOut = false
  }
}

const signOutAll = async () => {
  try {
    const user = getUserData()
    if (!user || !user.id) {
      throw new Error('User not authenticated')
    }

    if (!confirm('Are you sure you want to sign out of all other devices? You will remain signed in on this device.')) {
      return
    }

    loading.value.signOutAll = true
    sessionMessage.value = ''
    console.log('🔄 Signing out all sessions for user:', user.id)

    const response = await api.delete(`/user-settings/${user.id}/sessions`)

    if (response.data.success) {
      sessionMessage.value = response.data.message
      sessionOk.value = true
      await loadSessions()
      console.log('✅ All sessions signed out')
    } else {
      throw new Error(response.data.message)
    }
  } catch (error) {
    console.error('❌ Failed to sign out all sessions:', error)
    sessionMessage.value = error.response?.data?.message || 'Failed to sign out sessions'
    sessionOk.value = false
  } finally {
    loading.value.signOutAll = false
  }
}

// Initialize user data and load settings when component mounts
onMounted(() => {
  const user = getUserData()
  if (user) {
    Object.assign(userData, user)
    console.log('👤 User data loaded:', userData)
    loadSessions()
  } else {
    console.error('❌ No user data found in localStorage')
  }

  loadNotificationPreferences()
  loadSecuritySettings()
})
</script>