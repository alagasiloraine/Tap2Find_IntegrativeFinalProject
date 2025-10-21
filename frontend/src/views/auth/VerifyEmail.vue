<template>
  <div class="auth-page">
    <!-- Auth Card -->
    <div class="bg-white py-8 px-6 shadow-lg rounded-lg">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="mb-4">
          <div class="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-2xl">📧</span>
          </div>
        </div>
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Verify Your Email</h1>
        <p class="text-gray-600">We've sent a verification code to</p>
        <p class="text-sm font-medium text-gray-800 mt-1">{{ email || 'user@example.com' }}</p>
      </div>

      <!-- OTP Form -->
      <form @submit.prevent="handleVerifyEmail" class="space-y-6">
        <!-- OTP Input Fields -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-4 text-center">
            Enter 6-digit verification code
          </label>
          <div class="flex justify-center gap-3">
            <input
              v-for="(digit, index) in otpDigits"
              :key="index"
              :ref="el => otpInputs[index] = el"
              v-model="otpDigits[index]"
              type="text"
              maxlength="1"
              required
              class="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @input="handleOtpInput(index, $event)"
              @keydown="handleOtpKeydown(index, $event)"
              @paste="handleOtpPaste"
            />
          </div>
        </div>

        <!-- Timer -->
        <div class="text-center">
          <p class="text-sm text-gray-600">
            Code expires in 
            <span class="font-medium text-blue-600">{{ formatTime(timeLeft) }}</span>
          </p>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="!isOtpComplete || isLoading"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!isLoading">Verify Email</span>
          <span v-else>Verifying...</span>
        </button>
      </form>

      <!-- Resend Code -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Didn't receive the code?
          <button
            @click="resendCode"
            :disabled="timeLeft > 0"
            class="font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {{ timeLeft > 0 ? `Resend in ${formatTime(timeLeft)}` : 'Resend Code' }}
          </button>
        </p>
      </div>

      <!-- Success Message -->
      <div v-if="verificationSuccess" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <span class="text-green-400 text-xl">✅</span>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">
              Email Verified!
            </h3>
            <div class="mt-2 text-sm text-green-700">
              <p>Your email has been successfully verified. You can now access all features.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <span class="text-red-400 text-xl">❌</span>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Verification Failed
            </h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ errorMessage }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Back to Login -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Wrong email?
          <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-500">
            Change Email
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  email: {
    type: String,
    default: ''
  }
})

const otpDigits = ref(['', '', '', '', '', ''])
const otpInputs = ref([])
const isLoading = ref(false)
const verificationSuccess = ref(false)
const errorMessage = ref('')
const timeLeft = ref(300) // 5 minutes in seconds

let timer = null

const isOtpComplete = computed(() => {
  return otpDigits.value.every(digit => digit !== '')
})

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const handleOtpInput = (index, event) => {
  const value = event.target.value
  
  // Only allow numbers
  if (!/^\d*$/.test(value)) {
    event.target.value = otpDigits.value[index]
    return
  }
  
  otpDigits.value[index] = value
  
  // Move to next input if current is filled
  if (value && index < 5) {
    otpInputs.value[index + 1]?.focus()
  }
}

const handleOtpKeydown = (index, event) => {
  // Handle backspace
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpInputs.value[index - 1]?.focus()
  }
}

const handleOtpPaste = (event) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
  
  for (let i = 0; i < pastedData.length && i < 6; i++) {
    otpDigits.value[i] = pastedData[i]
  }
  
  // Focus the next empty input or the last one
  const nextIndex = Math.min(pastedData.length, 5)
  otpInputs.value[nextIndex]?.focus()
}

const handleVerifyEmail = async () => {
  if (!isOtpComplete.value) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const otpCode = otpDigits.value.join('')
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Verifying OTP:', otpCode)
    
    // Simulate verification (replace with actual logic)
    if (otpCode === '123456') {
      verificationSuccess.value = true
      // TODO: Redirect to dashboard or next step
    } else {
      errorMessage.value = 'Invalid verification code. Please try again.'
      // Clear OTP inputs
      otpDigits.value = ['', '', '', '', '', '']
      otpInputs.value[0]?.focus()
    }
  } catch (error) {
    errorMessage.value = 'Verification failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const resendCode = async () => {
  if (timeLeft.value > 0) return
  
  try {
    console.log('Resending verification code to:', props.email)
    // TODO: Implement resend logic
    
    // Reset timer
    timeLeft.value = 300
    startTimer()
    
    // Clear current OTP
    otpDigits.value = ['', '', '', '', '', '']
    otpInputs.value[0]?.focus()
  } catch (error) {
    console.error('Error resending code:', error)
  }
}

const startTimer = () => {
  timer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

onMounted(() => {
  startTimer()
  // Focus first input
  setTimeout(() => {
    otpInputs.value[0]?.focus()
  }, 100)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>
