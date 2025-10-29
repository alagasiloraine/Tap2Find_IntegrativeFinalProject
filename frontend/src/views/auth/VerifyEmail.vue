<template>
  <div class="auth-page bg-white">
    <!-- Auth Card -->
    <div class="py-8 px-6 relative">
      <button @click="goBack" class="absolute top-2 left-2 p-2 text-gray-600">
        <iconify-icon icon="material-symbols:arrow-back-ios-rounded" class="w-5 h-5" />
      </button>
      <!-- Header -->
      <div class="text-center mb-8">
        <iframe
          src="https://lottie.host/embed/3aaed7c4-84f2-4923-bde8-ae95a2502fa6/zET5kXzx2P.lottie"
          class="w-40 h-40 md:w-48 md:h-48 mx-auto mb-2"
          style="border:0;"
          title="Verify email animation"
        ></iframe>
        <h1 class="text-3xl font-semibold text-gray-800">Verify Your Email</h1>
        <p class="text-gray-400">Enter the OTP sent to your email</p>
      </div>

      <!-- OTP Form -->
      <form @submit.prevent="verifyOTP" class="space-y-6">
        <!-- OTP Input Fields -->
        <div class="text-center mb-6">
          <p class="text-gray-600 mb-4">
            We've sent a 6-digit code to <strong>{{ email }}</strong>
          </p>
          
          <!-- OTP Input Container -->
          <div class="flex justify-center space-x-3 mb-6">
            <input
              v-for="(digit, index) in otpDigits"
              :key="index"
              :ref="el => otpInputs[index] = el"
              v-model="otpDigits[index]"
              type="text"
              maxlength="1"
              class="w-12 h-12 text-center text-xl font-semibold bg-gray-50 rounded-md text-[#102A71] focus:border-[#102A71] focus:ring-1 focus:ring-[#102A71] focus:ring-opacity-100 transition-colors"
              @input="handleOTPInput(index, $event)"
              @keydown="handleKeyDown(index, $event)"
              @paste="handlePaste"
            />
          </div>
        </div>

        <!-- Timer -->
        <div class="text-center mb-6">
          <p class="text-sm text-gray-500">
            Code expires in: <span class="font-medium text-red-600">{{ formatTime(timeLeft) }}</span>
          </p>
        </div>

        <!-- Verify Button -->
        <button
          type="submit"
          :disabled="!isOTPComplete || isVerifying"
          class="w-full bg-[#F5C400] text-white py-2 px-4 rounded-full hover:bg-[#e8bc09] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isVerifying ? 'Verifying...' : 'Verify OTP' }}
        </button>
      </form>

      <!-- Resend Section -->
      <div class="mt-6">
        <div class="text-sm text-gray-500 flex items-center justify-between">
          <span>Didn't receive the code?</span>
          <button
            @click="resendOTP"
            :disabled="isResending || timeLeft > 0"
            class="text-[#102A71] hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isResending ? 'Sending...' : 'Resend OTP' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Get email from route params or use default
const email = ref(route.query.email || 'your-email@example.com')

// OTP related state
const otpDigits = ref(['', '', '', '', '', ''])
const otpInputs = ref([])
const isVerifying = ref(false)
const isResending = ref(false)
const timeLeft = ref(300) // 5 minutes in seconds
let timer = null

// Computed properties
const isOTPComplete = computed(() => {
  return otpDigits.value.every(digit => digit !== '')
})

const otpCode = computed(() => {
  return otpDigits.value.join('')
})

// Timer functions
const startTimer = () => {
  timeLeft.value = 300 // Reset to 5 minutes
  timer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// OTP input handling
const handleOTPInput = (index, event) => {
  const value = event.target.value
  
  // Only allow numbers
  if (!/^\d*$/.test(value)) {
    event.target.value = otpDigits.value[index]
    return
  }
  
  otpDigits.value[index] = value
  
  // Auto-focus next input
  if (value && index < 5) {
    otpInputs.value[index + 1]?.focus()
  }
}

const handleKeyDown = (index, event) => {
  // Handle backspace
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpInputs.value[index - 1]?.focus()
  }
}

const handlePaste = (event) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
  
  for (let i = 0; i < pastedData.length && i < 6; i++) {
    otpDigits.value[i] = pastedData[i]
  }
  
  // Focus the next empty input or the last one
  const nextEmptyIndex = otpDigits.value.findIndex(digit => digit === '')
  const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5
  otpInputs.value[focusIndex]?.focus()
}

// Verification function
const verifyOTP = async () => {
  if (!isOTPComplete.value) return
  
  isVerifying.value = true
  
  try {
    // TODO: Implement actual OTP verification logic
    console.log('Verifying OTP:', otpCode.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // For demo purposes, accept any 6-digit code
    if (otpCode.value.length === 6) {
      alert('Email verified successfully!')
      router.push('/login')
    } else {
      alert('Invalid OTP. Please try again.')
      // Clear OTP inputs
      otpDigits.value = ['', '', '', '', '', '']
      otpInputs.value[0]?.focus()
    }
    
  } catch (error) {
    console.error('Error verifying OTP:', error)
    alert('Verification failed. Please try again.')
  } finally {
    isVerifying.value = false
  }
}

const resendOTP = async () => {
  if (timeLeft.value > 0) return
  
  isResending.value = true
  
  try {
    // TODO: Implement actual resend OTP logic
    console.log('Resending OTP to:', email.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Clear current OTP and start new timer
    otpDigits.value = ['', '', '', '', '', '']
    startTimer()
    
    alert('New OTP sent successfully!')
    
  } catch (error) {
    console.error('Error resending OTP:', error)
    alert('Failed to resend OTP. Please try again.')
  } finally {
    isResending.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}

const goBack = () => {
  router.back()
}

// Lifecycle hooks
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
