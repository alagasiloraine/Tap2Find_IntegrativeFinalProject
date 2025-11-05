<template>
  <div class="admin-dashboard">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="mt-2 text-gray-600">Welcome to your Tap2Find admin panel</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <!-- Total Professors -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <span class="text-white text-lg">🎓</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Professors</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.totalProfessors?.toLocaleString() || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Total Students -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                <span class="text-white text-lg">🧑‍🎓</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.totalStudents?.toLocaleString() || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Active RFID Tap-ins Today -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <span class="text-white text-lg">📡</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Active RFID Tap-ins Today</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.activeRFIDTapInsToday?.toLocaleString() || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Total Concerns Logged -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                <span class="text-white text-lg">📝</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Concerns Logged</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.totalConcerns?.toLocaleString() || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Total Concerns Logged -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                <span class="text-white text-lg">📝</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Concerns Logged</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.totalConcerns?.toLocaleString() || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Professor Availability</h3>
        <div class="space-y-4">
          <div class="w-full h-6 rounded-md overflow-hidden flex bg-gray-100">
            <div class="h-full bg-green-500" :style="{ width: availability.availablePct + '%' }"></div>
            <div class="h-full bg-yellow-500" :style="{ width: availability.busyPct + '%' }"></div>
            <div class="h-full bg-red-500" :style="{ width: availability.notAvailablePct + '%' }"></div>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div class="flex items-center justify-between bg-green-50 border border-green-200 rounded-md px-3 py-2">
              <span class="text-sm text-green-700">Available</span>
              <span class="text-sm font-semibold text-green-800">{{ availability.available }} ({{ availability.availablePct }}%)</span>
            </div>
            <div class="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2">
              <span class="text-sm text-yellow-700">Busy</span>
              <span class="text-sm font-semibold text-yellow-800">{{ availability.busy }} ({{ availability.busyPct }}%)</span>
            </div>
            <div class="flex items-center justify-between bg-red-50 border border-red-200 rounded-md px-3 py-2">
              <span class="text-sm text-red-700">Not Available</span>
              <span class="text-sm font-semibold text-red-800">{{ availability.notAvailable }} ({{ availability.notAvailablePct }}%)</span>
            </div>
          </div>
          <div class="text-xs text-gray-500">Total professors: {{ availability.total }}</div>
        </div>
      </div>

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
    </div>


  </div>
</template>
<script>
import api from "@/plugin/axios.js";

export default {
  name: "AdminDashboard",
  data() {
    return {
      stats: {},
      users: [],
      loading: true,
    };
  },
  mounted() {
    this.fetchDashboard();
    this.fetchUsers();
  },
  computed: {
    availability() {
      const a = this.stats?.professorAvailability || {};
      const available = Number(a.available || 0);
      const busy = Number(a.busy || 0);
      const notAvailable = Number(a.notAvailable || 0);
      const total = available + busy + notAvailable;
      const pct = (n) => (total > 0 ? Math.round((n / total) * 100) : 0);
      return {
        available,
        busy,
        notAvailable,
        total,
        availablePct: pct(available),
        busyPct: pct(busy),
        notAvailablePct: pct(notAvailable),
      };
    },
  },
  methods: {
async fetchDashboard() {
  const res = await api.get("/admin/stats");
  this.stats = res.data.stats;
},
async fetchUsers() {
  try {
    const res = await api.get("/admin/users");
    this.users = res.data.users;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

  }
};
</script>


