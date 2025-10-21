<template>
  <div class="admin-dashboard">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="mt-2 text-gray-600">Welcome to your Tap2Find admin panel</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <!-- Total Users -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span class="text-white text-lg">👥</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.totalUsers.toLocaleString() }}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <span class="text-green-600 font-medium">+12%</span>
            <span class="text-gray-500"> from last month</span>
          </div>
        </div>
      </div>

      <!-- Active Sessions -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <span class="text-white text-lg">🟢</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Active Sessions</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.activeSessions.toLocaleString() }}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <span class="text-green-600 font-medium">+8%</span>
            <span class="text-gray-500"> from last hour</span>
          </div>
        </div>
      </div>

      <!-- Total Revenue -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                <span class="text-white text-lg">💰</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                <dd class="text-lg font-medium text-gray-900">${{ stats.totalRevenue.toLocaleString() }}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <span class="text-green-600 font-medium">+23%</span>
            <span class="text-gray-500"> from last month</span>
          </div>
        </div>
      </div>

      <!-- System Health -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <span class="text-white text-lg">⚡</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">System Health</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.systemHealth }}%</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <span class="text-green-600 font-medium">All systems operational</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- User Growth Chart -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">User Growth</h3>
        <div class="h-64 bg-gray-50 rounded-md flex items-center justify-center">
          <div class="text-center">
            <span class="text-4xl mb-2 block">📈</span>
            <p class="text-gray-500">Chart placeholder</p>
            <p class="text-sm text-gray-400">User growth over time</p>
          </div>
        </div>
      </div>

      <!-- Revenue Chart -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Revenue Trends</h3>
        <div class="h-64 bg-gray-50 rounded-md flex items-center justify-center">
          <div class="text-center">
            <span class="text-4xl mb-2 block">💹</span>
            <p class="text-gray-500">Chart placeholder</p>
            <p class="text-sm text-gray-400">Revenue trends over time</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Recent Activity</h3>
      </div>
      <div class="divide-y divide-gray-200">
        <div v-for="activity in recentActivity" :key="activity.id" class="px-6 py-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span class="text-gray-600 text-sm">{{ activity.icon }}</span>
              </div>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
              <p class="text-sm text-gray-500">{{ activity.description }}</p>
            </div>
            <div class="ml-4 flex-shrink-0">
              <p class="text-sm text-gray-500">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stats = ref({
  totalUsers: 12543,
  activeSessions: 892,
  totalRevenue: 45678,
  systemHealth: 99
})

const recentActivity = ref([
  {
    id: 1,
    icon: '👤',
    title: 'New user registered',
    description: 'john.doe@example.com joined the platform',
    time: '2 minutes ago'
  },
  {
    id: 2,
    icon: '💳',
    title: 'Payment processed',
    description: 'Premium subscription activated for user #1234',
    time: '5 minutes ago'
  },
  {
    id: 3,
    icon: '🔧',
    title: 'System maintenance',
    description: 'Database optimization completed successfully',
    time: '1 hour ago'
  },
  {
    id: 4,
    icon: '📧',
    title: 'Email campaign sent',
    description: 'Newsletter sent to 2,543 subscribers',
    time: '2 hours ago'
  },
  {
    id: 5,
    icon: '🛡️',
    title: 'Security alert',
    description: 'Suspicious login attempt blocked from IP 192.168.1.1',
    time: '3 hours ago'
  }
])
</script>
