<template>
  <div class="auth-page">
    <!-- Auth Card -->
    <div class="bg-white py-8 px-6 shadow-lg rounded-lg">
      <!-- Header -->
      <div class="text-center mb-8">
        <img src="/t2flogo.gif" alt="Tap2Find Logo" class="w-24 h-24 mx-auto mb-2" />
        <h1 class="text-3xl font-semibold text-gray-800">Let's Get Started</h1>
        <p class="text-gray-400">Join Tap2Find and start your journey</p>
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
              class="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#102A71] focus:ring-opacity-100 transition-colors"
              :class="form.firstName ? 'border-black text-black' : 'border-gray-400 text-gray-400'"
              @focus="isFirstNameFocused = true"
              @blur="isFirstNameFocused = false"
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
          </div>
          <div class="relative">
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              required
              class="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#102A71] focus:ring-opacity-100 transition-colors"
              :class="form.lastName ? 'border-black text-black' : 'border-gray-400 text-gray-400'"
              @focus="isLastNameFocused = true"
              @blur="isLastNameFocused = false"
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
          </div>
        </div>

        <!-- ID Number and Contact Number Fields -->
        <div class="grid grid-cols-5 gap-4">
          <div class="relative col-span-2">
            <input
              id="idNumber"
              v-model="form.idNumber"
              type="text"
              required
              class="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#102A71] focus:ring-opacity-100 transition-colors"
              :class="form.idNumber ? 'border-black text-black' : 'border-gray-400 text-gray-400'"
              @focus="isIdNumberFocused = true"
              @blur="isIdNumberFocused = false"
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
          </div>
          <div class="relative col-span-3">
            <input
              id="contactNumber"
              v-model="form.contactNumber"
              type="tel"
              required
              class="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#102A71] focus:ring-opacity-100 transition-colors"
              :class="form.contactNumber ? 'border-black text-black' : 'border-gray-400 text-gray-400'"
              @focus="isContactNumberFocused = true"
              @blur="isContactNumberFocused = false"
            />
            <label 
              for="contactNumber" 
              class="absolute left-3 transition-all duration-200 pointer-events-none"
              :class="(form.contactNumber || isContactNumberFocused) ? '-top-2 text-xs text-black bg-white px-1' : 'top-2 text-sm text-gray-400'"
            >
              Contact Number
            </label>
            <!-- Example text visible when focused but empty -->
            <div 
              v-if="isContactNumberFocused && !form.contactNumber"
              class="absolute left-3 top-2 text-sm text-gray-300 pointer-events-none"
              style="z-index: 1;"
            >
              +63 912 345 6789
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
            class="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#102A71] focus:ring-opacity-100 transition-colors"
            :class="form.email ? 'border-black text-black' : 'border-gray-400 text-gray-400'"
            @focus="isEmailFocused = true"
            @blur="isEmailFocused = false"
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
        </div>

        <!-- Password Field -->
        <div class="relative">
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#102A71] focus:ring-opacity-100 transition-colors"
            :class="form.password ? 'border-black text-black' : 'border-gray-400 text-gray-400'"
            @focus="isPasswordFocused = true"
            @blur="isPasswordFocused = false"
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
        </div>

        <!-- Confirm Password Field -->
        <div class="relative">
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            class="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#102A71] focus:ring-opacity-100 transition-colors"
            :class="form.confirmPassword ? 'border-black text-black' : 'border-gray-400 text-gray-400'"
            @focus="isConfirmPasswordFocused = true"
            @blur="isConfirmPasswordFocused = false"
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
        </div>

        <!-- Terms and Conditions -->
        <div class="flex items-center">
          <input
            id="terms"
            v-model="form.acceptTerms"
            type="checkbox"
            required
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="terms" class="ml-2 block text-sm text-gray-700">
            I agree to the 
            <a href="#" class="text-blue-600 hover:text-blue-500">Terms of Service</a>
            and 
            <a href="#" class="text-blue-600 hover:text-blue-500">Privacy Policy</a>
          </label>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-[#F5C400] text-white py-2 px-4 rounded-full hover:bg-[#e8bc09] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors relative"
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
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
      </div>

      <!-- Social Register -->
      <div class="mt-6">
        <button class="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-xl bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
          <span class="sr-only">Sign up with Gmail</span>
          <Mail class="w-4 h-4 mr-2" />
          Gmail
        </button>
      </div>

      <!-- Sign In Link -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Already have an account?
          <router-link to="/auth/login" class="font-medium text-blue-600 hover:text-blue-500" :class="isLoading ? 'pointer-events-none opacity-50' : ''">
            Sign in
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Mail } from 'lucide-vue-next'

const router = useRouter()

const form = ref({
  firstName: '',
  lastName: '',
  idNumber: '',
  contactNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

// Focus states for floating labels
const isFirstNameFocused = ref(false)
const isLastNameFocused = ref(false)
const isIdNumberFocused = ref(false)
const isContactNumberFocused = ref(false)
const isEmailFocused = ref(false)
const isPasswordFocused = ref(false)
const isConfirmPasswordFocused = ref(false)

const loading = ref(false)

const handleRegister = async () => {
  console.log('Register attempt:', form.value)
  if (!form.value.firstName || !form.value.lastName || !form.value.idNumber || !form.value.contactNumber || !form.value.email || !form.value.password || !form.value.confirmPassword) {
    alert('Please fill out all required fields')
    return
  }
  if (form.value.password !== form.value.confirmPassword) {
    alert('Passwords do not match')
    return
  }
  if (!form.value.acceptTerms) {
    alert('Please accept the terms')
    return
  }
  try {
    loading.value = true
    const payload = {
      role: 'student',
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      idNumber: form.value.idNumber,
      contactNumber: form.value.contactNumber,
      emailAddress: form.value.email,
      password: form.value.password,
      middleName: '',
      facultyPosition: '',
      program: '',
      yearLevel: '',
      section: '',
      avatarUrl: '',
      coverUrl: ''
    }
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed')
    }
    alert('Registered! Please check your email for the OTP.')
    await router.push({ path: '/verify-email', query: { email: payload.emailAddress } })
  } catch (err) {
    alert(err.message)
  } finally {
    loading.value = false
  }
}
</script>
