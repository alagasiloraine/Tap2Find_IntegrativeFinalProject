<template>
  <div class="auth-page bg-white">
    <!-- Auth Card -->
    <div class="bg-white py-8 px-6 shadow-lg rounded-lg">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center">
          <img src="/t2flogo.gif" alt="Tap2Find Logo" class="w-12 h-12 mr-1" />
          <h1 class="text-3xl font-semibold text-gray-800">Hello Again!</h1>
        </div>
        <p class="text-gray-500">Welcome Back, you've been missed.</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
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

        <!-- Remember Me & Forgot Password -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember"
              v-model="form.remember"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="remember" class="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <router-link to="/forgot-password" class="text-sm text-blue-600 hover:text-blue-500">
            Forgot password?
          </router-link>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-[#F5C400] text-white py-2 px-4 rounded-full hover:bg-[#e8bc09] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Sign In
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

      <!-- Social Login -->
      <div class="mt-6">
        <button class="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-xl bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
          <span class="sr-only">Sign in with Gmail</span>
          <Mail class="w-4 h-4 mr-2" />
          Gmail
        </button>
      </div>

      <!-- Sign Up Link -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Don't have an account?
          <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Mail } from 'lucide-vue-next'

const form = ref({
  email: '',
  password: '',
  remember: false
})

// Focus states for floating labels
const isEmailFocused = ref(false)
const isPasswordFocused = ref(false)

const handleLogin = () => {
  console.log('Login attempt:', form.value)
  // TODO: Implement actual login logic
}
</script>
