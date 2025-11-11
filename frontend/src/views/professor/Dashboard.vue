<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Welcome back, Prof. {{ user.firstName }}!</h2>
          <p class="text-gray-600 mt-1">Here's what's happening in your classes today.</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-500">Today</p>
          <p class="text-lg font-semibold text-gray-900">{{ currentDate }}</p>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Students -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100">
            <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Students</p>
            <p class="text-2xl font-semibold text-gray-900">156</p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-green-600 text-sm font-medium">+12%</span>
          <span class="text-gray-500 text-sm ml-1">from last month</span>
        </div>
      </div>

      <!-- Active Classes -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100">
            <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Active Classes</p>
            <p class="text-2xl font-semibold text-gray-900">8</p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-green-600 text-sm font-medium">+2</span>
          <span class="text-gray-500 text-sm ml-1">new this semester</span>
        </div>
      </div>

      <!-- Pending Assignments -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100">
            <svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Pending Reviews</p>
            <p class="text-2xl font-semibold text-gray-900">23</p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-red-600 text-sm font-medium">+5</span>
          <span class="text-gray-500 text-sm ml-1">due this week</span>
        </div>
      </div>

      <!-- Average Grade -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100">
            <svg class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Average Grade</p>
            <p class="text-2xl font-semibold text-gray-900">87.5%</p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-green-600 text-sm font-medium">+2.3%</span>
          <span class="text-gray-500 text-sm ml-1">improvement</span>
        </div>
      </div>
    </div>

    <!-- Recent Activity & Upcoming Classes -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Activity -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <div class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-900">John Doe submitted Assignment #3</p>
                <p class="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-900">New message from Sarah Wilson</p>
                <p class="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <div class="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <svg class="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-900">Assignment #4 due tomorrow</p>
                <p class="text-xs text-gray-500">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Classes -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Upcoming Classes</h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p class="font-medium text-gray-900">Data Structures</p>
                <p class="text-sm text-gray-600">Room 201 • 30 students</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-blue-600">9:00 AM</p>
                <p class="text-xs text-gray-500">Today</p>
              </div>
            </div>

            <div class="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p class="font-medium text-gray-900">Algorithms</p>
                <p class="text-sm text-gray-600">Room 305 • 25 students</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-green-600">11:00 AM</p>
                <p class="text-xs text-gray-500">Today</p>
              </div>
            </div>

            <div class="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <p class="font-medium text-gray-900">Software Engineering</p>
                <p class="text-sm text-gray-600">Room 102 • 35 students</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-purple-600">2:00 PM</p>
                <p class="text-xs text-gray-500">Tomorrow</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const user = ref({
  firstName: '',
  lastName: '',
  role: '',
  emailAddress: '',
  status: ''
})

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
</script>
