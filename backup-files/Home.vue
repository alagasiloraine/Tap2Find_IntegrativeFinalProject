<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
          <h1 class="text-4xl font-bold mb-4">Welcome back, {{ user.firstName }}! 👋</h1>
          <p class="text-xl text-blue-100 mb-8">Ready to continue your learning journey?</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              View Today's Classes
            </button>
            <button class="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Check Assignments
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Active Classes -->
        <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Active Classes</p>
              <p class="text-3xl font-bold text-gray-900">5</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <p class="text-sm text-green-600 mt-2">+2 this semester</p>
        </div>

        <!-- Pending Assignments -->
        <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Pending Assignments</p>
              <p class="text-3xl font-bold text-gray-900">8</p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-full">
              <svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p class="text-sm text-yellow-600 mt-2">3 due this week</p>
        </div>

        <!-- Average Grade -->
        <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Average Grade</p>
              <p class="text-3xl font-bold text-gray-900">87%</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p class="text-sm text-blue-600 mt-2">+5% improvement</p>
        </div>

        <!-- Messages -->
        <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">New Messages</p>
              <p class="text-3xl font-bold text-gray-900">12</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-full">
              <svg class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
          <p class="text-sm text-purple-600 mt-2">2 from professors</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Today's Schedule -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-900">Today's Schedule</h2>
              <span class="text-sm text-gray-500">{{ currentDate }}</span>
            </div>
            
            <div class="space-y-4">
              <!-- Class 1 -->
              <div class="flex items-center p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span class="text-white font-bold">CS</span>
                  </div>
                </div>
                <div class="ml-4 flex-1">
                  <h3 class="font-semibold text-gray-900">Data Structures</h3>
                  <p class="text-sm text-gray-600">Prof. Johnson • Room 201</p>
                  <p class="text-sm text-blue-600 font-medium">9:00 AM - 10:30 AM</p>
                </div>
                <div class="text-right">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Live
                  </span>
                </div>
              </div>

              <!-- Class 2 -->
              <div class="flex items-center p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <span class="text-white font-bold">MATH</span>
                  </div>
                </div>
                <div class="ml-4 flex-1">
                  <h3 class="font-semibold text-gray-900">Calculus II</h3>
                  <p class="text-sm text-gray-600">Prof. Smith • Room 305</p>
                  <p class="text-sm text-green-600 font-medium">11:00 AM - 12:30 PM</p>
                </div>
                <div class="text-right">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Upcoming
                  </span>
                </div>
              </div>

              <!-- Class 3 -->
              <div class="flex items-center p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <span class="text-white font-bold">ENG</span>
                  </div>
                </div>
                <div class="ml-4 flex-1">
                  <h3 class="font-semibold text-gray-900">Technical Writing</h3>
                  <p class="text-sm text-gray-600">Prof. Davis • Room 102</p>
                  <p class="text-sm text-purple-600 font-medium">2:00 PM - 3:30 PM</p>
                </div>
                <div class="text-right">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Later
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity & Quick Actions -->
        <div class="space-y-6">
          <!-- Recent Activity -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div class="space-y-3">
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-900">Submitted Assignment #3</p>
                  <p class="text-xs text-gray-500">Data Structures • 2 hours ago</p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-900">New grade posted</p>
                  <p class="text-xs text-gray-500">Calculus II • 4 hours ago</p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg class="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-900">Assignment due tomorrow</p>
                  <p class="text-xs text-gray-500">Technical Writing • 6 hours ago</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div class="space-y-3">
              <button class="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <span class="text-blue-700 font-medium">View All Assignments</span>
                <svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button class="w-full flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <span class="text-green-700 font-medium">Check Grades</span>
                <svg class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button class="w-full flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <span class="text-purple-700 font-medium">Message Professors</span>
                <svg class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 🧩 Reactive user state
const user = ref({
  firstName: '',
  lastName: '',
  role: '',
  emailAddress: ''
})

// Load user data from localStorage
onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
})

// 🗓️ Display current date
const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
</script>
