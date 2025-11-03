<template>
  <div class="auth-page">
    <!-- Auth Card -->
    <div class="bg-white py-8 px-6 shadow-lg rounded-lg">
      <!-- Header -->
      <div class="text-center mb-8">
        <img src="/t2flogo.gif" alt="Tap2Find Logo" class="w-24 h-24 mx-auto mb-2" />
        <h1 class="text-3xl font-semibold text-gray-800">Let's Get Started</h1>
        <p class="text-gray-400">Join Tap2Find and start your journey</p>

        <!-- notification message template ( redesign as needed ) -->
        <div v-if="showMessage" class="text-green-600 mt-2 transition-opacity duration-300" :class="messageFadeClass">
          {{ message }}
        </div>
        <div v-if="showError" class="text-red-600 mt-2 transition-opacity duration-300" :class="errorFadeClass">
          {{ error }}
        </div>
      </div>

      <!-- Register Form -->
      <form @submit.prevent="handleRegister" class="space-y-6">
        <!-- Name Fields -->
        <div class="grid grid-cols-2 gap-4">
          <div class="relative">
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              required
              :disabled="isLoading"
              class="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#102A71] focus:ring-opacity-100 transition-colors"
              :class="getInputClasses('firstName')"
              @focus="isFirstNameFocused = true"
              @blur="isFirstNameFocused = false; validateField('firstName')"
            />
            <label 
              for="firstName" 
              class="absolute left-3 transition-all duration-200 pointer-events-none"
              :class="(form.firstName || isFirstNameFocused) ? '-top-2 text-xs text-black bg-white px-1' : 'top-2 text-sm text-gray-400'"
            >
              First Name
            </label>
            <!-- Example text visible when focused but empty -->
            <div 
              v-if="isFirstNameFocused && !form.firstName"
              class="absolute left-3 top-2 text-sm text-gray-300 pointer-events-none"
              style="z-index: 1;"
            >
              John
            </div>
            <!-- Validation Message -->
            <div v-if="errors.firstName" class="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">
              {{ errors.firstName }}
            </div>
          </div>
          
          <div class="relative">
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              required
              :disabled="isLoading"
              class="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#102A71] focus:ring-opacity-100 transition-colors"
              :class="getInputClasses('lastName')"
              @focus="isLastNameFocused = true"
              @blur="isLastNameFocused = false; validateField('lastName')"
            />
            <label 
              for="lastName" 
              class="absolute left-3 transition-all duration-200 pointer-events-none"
              :class="(form.lastName || isLastNameFocused) ? '-top-2 text-xs text-black bg-white px-1' : 'top-2 text-sm text-gray-400'"
            >
              Last Name
            </label>
            <!-- Example text visible when focused but empty -->
            <div 
              v-if="isLastNameFocused && !form.lastName"
              class="absolute left-3 top-2 text-sm text-gray-300 pointer-events-none"
              style="z-index: 1;"
            >
              Doe
            </div>
            <!-- Validation Message -->
            <div v-if="errors.lastName" class="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">
              {{ errors.lastName }}
            </div>
          </div>
        </div>

        <!-- ID Number and Contact Number Fields -->
        <div class="grid grid-cols-1 gap-4">
          <div class="relative">
            <input
              id="idNumber"
              v-model="form.idNumber"
              type="text"
              required
              :disabled="isLoading"
              class="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#102A71] focus:ring-opacity-100 transition-colors"
              :class="getInputClasses('idNumber')"
              @focus="isIdNumberFocused = true"
              @blur="isIdNumberFocused = false; validateField('idNumber')"
            />
            <label 
              for="idNumber" 
              class="absolute left-3 transition-all duration-200 pointer-events-none"
              :class="(form.idNumber || isIdNumberFocused) ? '-top-2 text-xs text-black bg-white px-1' : 'top-2 text-sm text-gray-400'"
            >
              ID Number
            </label>
            <!-- Example text visible when focused but empty -->
            <div 
              v-if="isIdNumberFocused && !form.idNumber"
              class="absolute left-3 top-2 text-sm text-gray-300 pointer-events-none"
              style="z-index: 1;"
            >
              MCC2022-1234
            </div>
            <!-- Validation Message -->
            <div v-if="errors.idNumber" class="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">
              {{ errors.idNumber }}
            </div>
          </div>
          
        </div>

        

        <!-- Email Field -->
        <div class="relative">
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            :disabled="isLoading"
            class="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#102A71] focus:ring-opacity-100 transition-colors"
            :class="getInputClasses('email')"
            @focus="isEmailFocused = true"
            @blur="isEmailFocused = false; validateField('email')"
          />
          <label 
            for="email" 
            class="absolute left-3 transition-all duration-200 pointer-events-none"
            :class="(form.email || isEmailFocused) ? '-top-2 text-xs text-black bg-white px-1' : 'top-2 text-sm text-gray-400'"
          >
            Email Address
          </label>
          <!-- Example text visible when focused but empty -->
          <div 
            v-if="isEmailFocused && !form.email"
            class="absolute left-3 top-2 text-sm text-gray-300 pointer-events-none"
            style="z-index: 1;"
          >
            john@example.com
          </div>
          <!-- Validation Message -->
          <div v-if="errors.email" class="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">
            {{ errors.email }}
          </div>
        </div>

        <!-- Password Field -->
        <div class="relative">
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            :disabled="isLoading"
            class="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#102A71] focus:ring-opacity-100 transition-colors"
            :class="getInputClasses('password')"
            @focus="isPasswordFocused = true"
            @blur="isPasswordFocused = false; validateField('password')"
          />
          <label 
            for="password" 
            class="absolute left-3 transition-all duration-200 pointer-events-none"
            :class="(form.password || isPasswordFocused) ? '-top-2 text-xs text-black bg-white px-1' : 'top-2 text-sm text-gray-400'"
          >
            Password
          </label>
          <!-- Example text visible when focused but empty -->
          <div 
            v-if="isPasswordFocused && !form.password"
            class="absolute left-3 top-2 text-sm text-gray-300 pointer-events-none"
            style="z-index: 1;"
          >
            ••••••••
          </div>
          <!-- Validation Message -->
          <div v-if="errors.password" class="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">
            {{ errors.password }}
          </div>
        </div>

        <!-- Confirm Password Field -->
        <div class="relative">
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            :disabled="isLoading"
            class="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#102A71] focus:ring-opacity-100 transition-colors"
            :class="getInputClasses('confirmPassword')"
            @focus="isConfirmPasswordFocused = true"
            @blur="isConfirmPasswordFocused = false; validateField('confirmPassword')"
          />
          <label 
            for="confirmPassword" 
            class="absolute left-3 transition-all duration-200 pointer-events-none"
            :class="(form.confirmPassword || isConfirmPasswordFocused) ? '-top-2 text-xs text-black bg-white px-1' : 'top-2 text-sm text-gray-400'"
          >
            Confirm Password
          </label>
          <!-- Example text visible when focused but empty -->
          <div 
            v-if="isConfirmPasswordFocused && !form.confirmPassword"
            class="absolute left-3 top-2 text-sm text-gray-300 pointer-events-none"
            style="z-index: 1;"
          >
            ••••••••
          </div>
          <!-- Validation Message -->
          <div v-if="errors.confirmPassword" class="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">
            {{ errors.confirmPassword }}
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="flex items-center">
          <input
            id="terms"
            v-model="form.acceptTerms"
            type="checkbox"
            required
            :disabled="isLoading"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
            :class="errors.acceptTerms ? 'border-red-500' : isLoading ? 'opacity-50 cursor-not-allowed' : ''"
          />
          <label for="terms" class="ml-2 block text-sm text-gray-700" :class="isLoading ? 'opacity-50' : ''">
            I agree to the 
            <a href="#" class="text-blue-600 hover:text-blue-500" :class="isLoading ? 'pointer-events-none' : ''">Terms of Service</a>
            and 
            <a href="#" class="text-blue-600 hover:text-blue-500" :class="isLoading ? 'pointer-events-none' : ''">Privacy Policy</a>
          </label>
        </div>
        <!-- Validation Message for Terms -->
        <div v-if="errors.acceptTerms" class="text-red-500 text-xs mt-1">
          {{ errors.acceptTerms }}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-[#F5C400] text-white py-2 px-4 rounded-xl hover:bg-[#e8bc09] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors relative"
          :class="isLoading ? 'opacity-70 cursor-not-allowed hover:bg-[#F5C400]' : ''"
        >
          <span :class="isLoading ? 'opacity-0' : ''">Create Account</span>
          <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </button>
      </form>

      <!-- Divider -->
      <!-- <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
      </div> -->

      <!-- Social Register -->
      <!-- <div class="mt-6">
        <button 
          :disabled="isLoading"
          class="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-xl bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
          :class="isLoading ? 'opacity-50 cursor-not-allowed hover:bg-white' : ''"
        >
          <span class="sr-only">Sign up with Gmail</span>
          <Mail class="w-4 h-4 mr-2" />
          Gmail
        </button>
      </div> -->

      <!-- Sign In Link -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Already have an account?
          <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500" :class="isLoading ? 'pointer-events-none opacity-50' : ''">
            Sign in
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { Mail } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import api from '../../utils/api.js'

const router = useRouter()

const form = ref({
  firstName: '',
  lastName: '',
  idNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
  role: 'student',
  facultyPosition: 'N/A',
})

// --- UI States ---
const isLoading = ref(false)
const message = ref('')
const error = ref('')

const showMessage = ref(false)
const showError = ref(false)
const messageFadeClass = ref('')
const errorFadeClass = ref('')

// Focus states for floating labels
const isFirstNameFocused = ref(false)
const isLastNameFocused = ref(false)
const isIdNumberFocused = ref(false)
const isEmailFocused = ref(false)
const isPasswordFocused = ref(false)
const isConfirmPasswordFocused = ref(false)

// Validation errors
const errors = ref({
  firstName: '',
  lastName: '',
  idNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: '',
})

// --- Regex patterns ---
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const idRegex = /^MCC\d{4}-\d{4}$/

let messageTimer = null
let errorTimer = null

// --- Show notification with auto-hide ---
const showNotification = (type, text, duration = 5000) => {
  // Clear existing timers
  if (messageTimer) clearTimeout(messageTimer)
  if (errorTimer) clearTimeout(errorTimer)

  if (type === 'success') {
    message.value = text
    showMessage.value = true
    messageFadeClass.value = 'opacity-100'
    
    // Start fade out 500ms before complete removal
    messageTimer = setTimeout(() => {
      messageFadeClass.value = 'opacity-0'
      
      setTimeout(() => {
        showMessage.value = false
        message.value = ''
        messageFadeClass.value = ''
      }, 300) // matches transition duration
    }, duration - 300)
  } else if (type === 'error') {
    error.value = text
    showError.value = true
    errorFadeClass.value = 'opacity-100'
    
    // Start fade out 500ms before complete removal
    errorTimer = setTimeout(() => {
      errorFadeClass.value = 'opacity-0'
      
      setTimeout(() => {
        showError.value = false
        error.value = ''
        errorFadeClass.value = ''
      }, 300) // matches transition duration
    }, duration - 300)
  }
}

// --- Input Classes Function ---
const getInputClasses = (fieldName) => {
  const baseClasses = 'w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#102A71] focus:ring-opacity-100 transition-colors'
  
  if (errors.value[fieldName]) {
    return `${baseClasses} border-red-500 text-red-500`
  }
  
  if (isLoading.value) {
    return `${baseClasses} border-gray-300 text-gray-400 opacity-70 cursor-not-allowed`
  }
  
  return form.value[fieldName] ? `${baseClasses} border-black text-black` : `${baseClasses} border-gray-400 text-gray-400`
}

// --- Field Validation Function ---
const validateField = (fieldName) => {
  if (isLoading.value) return
  
  errors.value[fieldName] = ''

  switch (fieldName) {
    case 'firstName':
      if (!form.value.firstName.trim()) {
        errors.value.firstName = 'First name is required.'
      }
      break
    case 'lastName':
      if (!form.value.lastName.trim()) {
        errors.value.lastName = 'Last name is required.'
      }
      break
    case 'idNumber':
      if (!idRegex.test(form.value.idNumber)) {
        errors.value.idNumber = 'Invalid ID format. Use MCCYYYY-NNNN (e.g., MCC2020-1234).'
      }
      break
    case 'email':
      if (!emailRegex.test(form.value.email)) {
        errors.value.email = 'Invalid email address format.'
      }
      break
    case 'password':
      if (form.value.password.length < 6) {
        errors.value.password = 'Password must be at least 6 characters long.'
      }
      break
    case 'confirmPassword':
      if (form.value.password !== form.value.confirmPassword) {
        errors.value.confirmPassword = 'Passwords do not match.'
      }
      break
    case 'acceptTerms':
      if (!form.value.acceptTerms) {
        errors.value.acceptTerms = 'You must accept the terms and conditions.'
      }
      break
  }
}

// --- Form Validation Function ---
const validateForm = () => {
  if (isLoading.value) return false
  
  // Validate all fields
  Object.keys(form.value).forEach(field => {
    if (field !== 'role' && field !== 'facultyPosition') {
      validateField(field)
    }
  })

  // Check if any errors exist
  return Object.values(errors.value).every(error => error === '')
}

// --- Register Function ---

const handleRegister = async () => {
  if (isLoading.value) return
  
  showMessage.value = false
  showError.value = false

  error.value = ''
  message.value = ''

  const isValid = validateForm()
  if (!isValid) {
    showNotification('error', 'Please fix the validation errors above.')
    return
  }

  isLoading.value = true

  try {
    const payload = {
      role: form.value.role,
      emailAddress: form.value.email,
      password: form.value.password,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      idNumber: form.value.idNumber,
      facultyPosition: 'N/A',
    }

    const response = await api.post('/auth/register', payload)
    showNotification('success', response.data.message || 'Registration successful!')

    // ✅ Generate random string
    const randomPath = Math.random().toString(36).substring(2, 10) + 
                       Math.random().toString(36).substring(2, 10)

    // ✅ Redirect after short delay
    setTimeout(() => {
      router.push({
        path: `/${randomPath}/verify-email`,
        query: { email: form.value.email }
      })
    }, 1500)
  } catch (err) {
    if (err.response && err.response.data) {
      showNotification('error', err.response.data.message || 'Registration failed.')
    } else {
      showNotification('error', 'Network error. Please try again later.')
    }
  } finally {
    isLoading.value = false
  }
}

onUnmounted(() => {
  if (messageTimer) clearTimeout(messageTimer)
  if (errorTimer) clearTimeout(errorTimer)
})
</script>