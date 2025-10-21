<template>
  <div class="auth-page">
    <!-- Auth Card -->
    <div class="bg-white py-8 px-6 shadow-lg rounded-lg">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
        <p class="text-gray-600">No worries! Enter your email and we'll send you a reset link.</p>
      </div>

      <!-- Forgot Password Form -->
      <form @submit.prevent="handleForgotPassword" class="space-y-6">
        <!-- Email Field -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email address"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!isLoading">Send Reset Link</span>
          <span v-else>Sending...</span>
        </button>
      </form>

      <!-- Success Message -->
      <div v-if="emailSent" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <span class="text-green-400 text-xl">✅</span>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">
              Email Sent!
            </h3>
            <div class="mt-2 text-sm text-green-700">
              <p>We've sent a password reset link to <strong>{{ form.email }}</strong></p>
              <p class="mt-1">Please check your email and follow the instructions to reset your password.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Back to Login -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Remember your password?
          <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            Back to Sign In
          </router-link>
        </p>
      </div>

      <!-- Additional Help -->
      <div class="mt-6 text-center">
        <p class="text-xs text-gray-500">
          Didn't receive the email? Check your spam folder or 
          <a href="#" class="text-blue-600 hover:text-blue-500" @click="resendEmail">
            resend the link
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  email: ''
})

const isLoading = ref(false)
const emailSent = ref(false)

const handleForgotPassword = async () => {
  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Forgot password request:', form.value)
    emailSent.value = true
    
    // TODO: Implement actual forgot password logic
  } catch (error) {
    console.error('Error:', error)
  } finally {
    isLoading.value = false
  }
}

const resendEmail = () => {
  emailSent.value = false
  // TODO: Implement resend logic
}
</script>
