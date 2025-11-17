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

      <!-- Daily Student Concerns (Last 14 days) -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-1">Daily Student Concerns (Last 14 days)</h3>
        <div class="text-xs text-gray-500 mb-4">Total: {{ dailyChart.total }}</div>
        <div class="h-48 flex items-end gap-2 border-b border-gray-200 pb-2">
          <div v-for="(d, idx) in dailyChart.points" :key="idx" class="flex-1 flex flex-col items-center justify-end">
            <div class="w-full bg-blue-200 rounded-t"
                 :style="{ height: (dailyChart.max > 0 ? Math.round((d.count / dailyChart.max) * 100) : 0) + '%', minHeight: d.count > 0 ? '6px' : '0' }"
                 :title="d.label + ': ' + d.count"></div>
            <div class="mt-1 text-[10px] text-gray-500 rotate-0">{{ d.label.slice(5) }}</div>
          </div>
        </div>
        <div class="mt-2 text-xs text-gray-500">Max per day: {{ dailyChart.max }}</div>
      </div>
    </div>


  </div>
</template>
<script>
import api from "@/utils/api.js";

export default {
  name: "AdminDashboard",
  data() {
    return {
      stats: {},
      users: [],
      loading: true,
      concerns: [],
    };
  },
  mounted() {
    this.fetchDashboard();
    this.fetchUsers();
    this.fetchConcerns();
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
    dailyChart() {
      const days = 14;
      const today = new Date();
      const labels = [];
      const map = new Map();
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        labels.push(key);
        map.set(key, 0);
      }
      for (const c of this.concerns) {
        const stamp = c.createdAt || c.timestamp || c.date;
        const d = stamp ? new Date(stamp) : null;
        if (!d || isNaN(d.getTime())) continue;
        const key = d.toISOString().slice(0, 10);
        if (map.has(key)) map.set(key, map.get(key) + 1);
      }
      const points = labels.map(l => ({ label: l, count: map.get(l) || 0 }));
      const max = points.reduce((m, p) => Math.max(m, p.count), 0);
      const total = points.reduce((s, p) => s + p.count, 0);
      return { points, max, total };
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
},
async fetchConcerns() {
  try {
    const res = await api.get('/admin/concerns');
    this.concerns = res.data.concerns || [];
  } catch (e) {
    console.error('Error fetching concerns:', e);
  }
}

  }
};
</script>

