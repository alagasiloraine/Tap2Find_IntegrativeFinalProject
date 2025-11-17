
<!-- Modify as needed -->
<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
      <h2 class="text-2xl font-semibold mb-4 text-center">Reset Password</h2>

      <form @submit.prevent="handleResetPassword">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">New Password</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full border rounded-md p-2 focus:ring-2 focus:ring-green-500"
            placeholder="Enter new password"
          />
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <button
          :disabled="isLoading"
          type="submit"
          class="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
        >
          {{ isLoading ? "Resetting..." : "Reset Password" }}
        </button>
      </form>

      <p v-if="successMessage" class="text-green-600 mt-3 text-center">{{ successMessage }}</p>
      <p v-if="errorMessage" class="text-red-600 mt-3 text-center">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/utils/api' // your single API config

const route = useRoute()
const router = useRouter()

const form = ref({ password: '' })
const token = ref('')
const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const errors = ref({ password: '' })

onMounted(() => {
  token.value = route.query.token || ''
  if (!token.value) {
    errorMessage.value = 'Invalid reset link.'
  }
})

const handleResetPassword = async () => {
  errors.value.password = ''
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.value.password || form.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters.'
    return
  }

  try {
    isLoading.value = true
    const res = await api.post('/auth/reset-password', {
      token: token.value,
      newPassword: form.value.password
    })

    successMessage.value = res.data.message
    setTimeout(() => router.push('/login'), 2000)
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Something went wrong.'
  } finally {
    isLoading.value = false
  }
}
</script>
