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
            :disabled="isLoading"
            :class="[
              'w-full px-3 py-2 border rounded-xl focus:outline-none transition-colors',
              isLoading ? 'opacity-50 cursor-not-allowed bg-gray-50' : '',
              isEmailFocused && !isLoading ? 'focus:ring-1 focus:ring-[#102A71]' : '',
              errors.email ? 'border-red-500' : form.email ? 'border-black' : 'border-gray-400'
            ]"
            @focus="isEmailFocused = true"
            @blur="isEmailFocused = false"
          />
          <label
            for="email"
            class="absolute left-3 transition-all duration-200 pointer-events-none bg-white px-1"
            :class="[
              (form.email || isEmailFocused) ? '-top-2 text-xs text-black' : 'top-2 text-sm text-gray-400',
              isLoading ? 'opacity-50' : ''
            ]"
          >
            Email Address
          </label>

          <!-- Example Placeholder -->
          <div
            v-if="isEmailFocused && !form.email && !isLoading"
            class="absolute left-3 top-2 text-sm text-gray-300 pointer-events-none"
          >
            john@example.com
          </div>

          <!-- Error Message -->
          <p v-if="errors.email" class="text-xs text-red-500 mt-1">{{ errors.email }}</p>
        </div>

        <!-- Password Field -->
        <div class="relative">
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            :disabled="isLoading"
            :class="[
              'w-full px-3 py-2 border rounded-xl focus:outline-none transition-colors',
              isLoading ? 'opacity-50 cursor-not-allowed bg-gray-50' : '',
              isPasswordFocused && !isLoading ? 'focus:ring-1 focus:ring-[#102A71]' : '',
              errors.password ? 'border-red-500' : form.password ? 'border-black' : 'border-gray-400'
            ]"
            @focus="isPasswordFocused = true"
            @blur="isPasswordFocused = false"
          />
          <label
            for="password"
            class="absolute left-3 transition-all duration-200 pointer-events-none bg-white px-1"
            :class="[
              (form.password || isPasswordFocused) ? '-top-2 text-xs text-black' : 'top-2 text-sm text-gray-400',
              isLoading ? 'opacity-50' : ''
            ]"
          >
            Password
          </label>

          <!-- Example Placeholder -->
          <div
            v-if="isPasswordFocused && !form.password && !isLoading"
            class="absolute left-3 top-2 text-sm text-gray-300 pointer-events-none"
          >
            ••••••••
          </div>

          <!-- Error Message -->
          <p v-if="errors.password" class="text-xs text-red-500 mt-1">{{ errors.password }}</p>
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="flex items-center justify-between">
          <!-- <div class="flex items-center">
            <input
              id="remember"
              v-model="form.remember"
              type="checkbox"
              :disabled="isLoading"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
              :class="isLoading ? 'opacity-50 cursor-not-allowed' : ''"
            />
            <label for="remember" class="ml-2 block text-sm text-gray-700" :class="isLoading ? 'opacity-50' : ''">
              Remember me
            </label>
          </div> -->
          <router-link 
            to="/forgot-password" 
            class="text-sm text-blue-600 hover:text-blue-500 transition-colors"
            :class="isLoading ? 'pointer-events-none opacity-50' : ''"
          >
            Forgot password?
          </router-link>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-[#F5C400] text-white py-3 px-4 rounded-xl hover:bg-[#e8bc09] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed relative"
        >
          <span :class="isLoading ? 'opacity-0' : ''">Sign In</span>
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

      <!-- Social Login -->
      <!-- <div class="mt-6">
        <button 
          :disabled="isLoading"
          class="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-xl bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
          :class="isLoading ? 'opacity-50 cursor-not-allowed hover:bg-white' : ''"
        >
          <span class="sr-only">Sign in with Gmail</span>
          <Mail class="w-4 h-4 mr-2" />
          Gmail
        </button>
      </div> -->

      <!-- Sign Up Link -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Don't have an account?
          <router-link 
            to="/auth/register" 
            class="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            :class="isLoading ? 'pointer-events-none opacity-50' : ''"
          >
            Sign up
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
import api from '@/utils/api'

const router = useRouter()

const form = ref({
  email: '',
  password: '',
  remember: false
})

const errors = ref({
  email: '',
  password: ''
})

const isEmailFocused = ref(false)
const isPasswordFocused = ref(false)
const isLoading = ref(false)

const handleLogin = async () => {
  if (isLoading.value) return
  
  errors.value = { email: '', password: '' }

  // 🧠 Validate inputs
  if (!form.value.email)
    errors.value.email = 'Email is required.'
  else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.value.email))
    errors.value.email = 'Please enter a valid email address.'
  if (!form.value.password)
    errors.value.password = 'Password is required.'
  if (errors.value.email || errors.value.password) return

  isLoading.value = true
  
  console.log('🔄 Attempting login with:', {
    email: form.value.email,
    passwordLength: form.value.password.length
  });

  try {
    const res = await api.post('/auth/login', {
      email: form.value.email,
      password: form.value.password
    })

    console.log('✅ Login API response:', res.data);

    if (res.data.success) {
      const { token, user } = res.data
      
      console.log('🔐 Storing user data:', {
        tokenLength: token.length,
        user: user
      });
      
      localStorage.setItem('token', token)
      localStorage.setItem('role', user.role)
      localStorage.setItem('user', JSON.stringify(user))

      // Set default authorization header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      console.log('🎉 Login successful, redirecting to:', user.role);

      // Redirect based on role
      if (user.role === 'student') router.push('/student')
      else if (user.role === 'professor') router.push('/professor')
      else if (user.role === 'admin') router.push('/admin')
      else {
        console.warn('⚠️ Unknown role, redirecting to default');
        router.push('/')
      }
    }

  } catch (err) {
    console.error('❌ Login error details:', {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message,
      config: err.config
    });
    
    const msg = err.response?.data?.message || 'An error occurred.'
    
    if (msg.includes('User not found') || err.response?.status === 404)
      errors.value.email = 'No account found with this email.'
    else if (msg.includes('Incorrect password') || err.response?.status === 401)
      errors.value.password = 'Incorrect password.'
    else if (msg.includes('not verified') || err.response?.status === 403)
      errors.value.email = 'Email not verified. Please check your inbox.'
    else if (err.response?.status === 400)
      errors.value.email = 'Invalid request. Please check your inputs.'
    else if (err.code === 'NETWORK_ERROR' || !navigator.onLine)
      errors.value.email = 'Network error. Please check your connection.'
    else
      errors.value.email = msg || 'Login failed. Please try again.'
      
  } finally {
    isLoading.value = false
  }
}
</script>