<template>
  <div class="admin-dashboard mt-1">
    <div v-if="loading" class="space-y-8">
      <!-- Skeleton: Stats Grid -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="n in 4"
          :key="n"
          class="bg-white overflow-hidden shadow rounded-lg p-5 animate-pulse"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-md bg-slate-200"></div>
            </div>
            <div class="ml-5 w-0 flex-1 space-y-2">
              <div class="h-3 w-24 bg-slate-200 rounded"></div>
              <div class="h-4 w-16 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Skeleton: Charts + right column -->
      <div class="flex flex-col lg:flex-row lg:items-stretch gap-8">
        <div class="bg-white shadow rounded-2xl flex-1 min-h-[28rem] border border-slate-100 animate-pulse">
          <div class="h-full p-6 space-y-4">
            <div class="h-4 w-40 bg-slate-200 rounded"></div>
            <div class="h-3 w-24 bg-slate-200 rounded"></div>
            <div class="mt-4 h-40 bg-slate-200 rounded"></div>
            <div class="mt-6 h-16 bg-slate-200 rounded"></div>
          </div>
        </div>
        <div class="flex flex-col gap-4 flex-1">
          <div class="bg-white shadow rounded-lg p-6 animate-pulse space-y-4">
            <div class="h-4 w-40 bg-slate-200 rounded"></div>
            <div class="h-4 w-full bg-slate-200 rounded"></div>
            <div class="h-4 w-3/4 bg-slate-200 rounded"></div>
          </div>
          <div class="shadow rounded-lg p-6 border border-slate-900/40 bg-[#001740] animate-pulse space-y-3">
            <div class="h-5 w-48 bg-slate-500/60 rounded"></div>
            <div class="h-3 w-32 bg-slate-500/60 rounded"></div>
            <div class="h-3 w-40 bg-slate-500/60 rounded"></div>
          </div>
          <div class="shadow rounded-lg px-4 py-3 border border-[#F5C400]/60 bg-[#F5C400] animate-pulse space-y-2">
            <div class="h-4 w-32 bg-[#f7e48a] rounded"></div>
            <div class="h-3 w-48 bg-[#f7e48a] rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <!-- Total Professors -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 rounded-md flex items-center justify-center bg-[#E5ECFF]"
              >
                <svg
                  class="w-6 h-6 text-[#102A71]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 9L12 5L21 9L12 13L3 9Z"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M7 11V15C7 16.657 9.239 18 12 18C14.761 18 17 16.657 17 15V11"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 truncate">Total Professors</dt>
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
              <div
                class="w-8 h-8 rounded-md flex items-center justify-center bg-[#E5ECFF]"
              >
                <svg
                  class="w-6 h-6 text-[#102A71]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 12C13.933 12 15.5 10.433 15.5 8.5C15.5 6.567 13.933 5 12 5C10.067 5 8.5 6.567 8.5 8.5C8.5 10.433 10.067 12 12 12Z"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6 19C6.84 16.667 9.2 15 12 15C14.8 15 17.16 16.667 18 19"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 truncate">Total Students</dt>
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
              <div
                class="w-8 h-8 rounded-md flex items-center justify-center bg-[#E5ECFF]"
              >
                <svg
                  class="w-5 h-5 text-[#102A71]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <!-- Wi-Fi signal icon -->
                  <path
                    d="M4.5 9.5C8.5 6 15.5 6 19.5 9.5"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M7 12C9.8 9.8 14.2 9.8 17 12"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M9.5 14.5C11 13.5 13 13.5 14.5 14.5"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="17.5"
                    r="1.2"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 truncate">Active RFID Tap-ins Today</dt>
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
              <div
                class="w-8 h-8 rounded-md flex items-center justify-center bg-[#E5ECFF]"
              >
                <svg
                  class="w-5 h-5 text-[#102A71]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 4H15L19 8V20H7V4Z"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M9.5 11H16.5M9.5 14H14.5"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 truncate">Total Concerns Logged</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.totalConcerns?.toLocaleString() || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>


    </div>

    <!-- Charts Section -->
    <div class="flex flex-col lg:flex-row lg:items-stretch gap-8 mb-8">
      <!-- Daily Student Concerns (Last 14 days) -->
      <div class="bg-white shadow rounded-2xl flex-1 flex flex-col min-h-[28rem] border border-slate-100 overflow-hidden">
        <!-- Header -->
        <div class="px-6 pt-5 pb-4 border-b border-slate-100 bg-white flex items-center justify-between">
          <div>
            <h3 class="text-sm font-semibold tracking-[0.18em] text-[#001740] uppercase">Daily Student Concerns (Last 14 days)</h3>
            <div class="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Total: <span class="ml-1 normal-case tracking-normal text-slate-600 font-normal">{{ dailyChart.total }}</span>
            </div>
          </div>
        </div>

        <!-- Chart body -->
        <div class="px-6 pt-4 pb-4 flex-1 flex flex-col">
          <div class="h-48 relative border-b border-slate-200 pb-2">
            <!-- Horizontal gridlines (no numbers) -->
            <div class="absolute inset-0 pointer-events-none flex flex-col justify-between">
              <div
                v-for="n in 5"
                :key="n"
                class="border-t border-dashed border-slate-200/80"
              ></div>
            </div>

            <!-- Bars row -->
            <div class="relative h-full flex items-end gap-2">
              <div
                v-for="(d, idx) in dailyChart.points"
                :key="idx"
                class="flex-1 flex flex-col items-center justify-end"
              >
                <!-- Numeric indicator above the bar -->
                <div v-if="d.count > 0" class="mb-1 text-[10px] font-semibold text-[#001740]">
                  {{ d.count }}
                </div>

                <!-- Bar -->
                <div
                  class="w-full rounded-t bg-[#102A71]/10"
                  :style="{
                    // Absolute scaling: ~6px per concern, capped visually at 25 concerns
                    height: d.count > 0 ? Math.min(d.count, 25) * 6 + 'px' : '0',
                    minHeight: d.count > 0 ? '8px' : '0',
                    background: d.count > 0
                      ? 'linear-gradient(to top, #E5ECFF, #102A71)'
                      : 'rgba(16,42,113,0.06)'
                  }"
                  :title="`${d.count} concern${d.count === 1 ? '' : 's'} on ${d.label}`"
                ></div>

                <!-- Date label -->
                <div class="mt-1 text-[10px] text-slate-500 rotate-0">
                  {{ d.label.slice(5) }}
                </div>
              </div>
            </div>
          </div>
          <!-- Latest concern -->
          <div class="mt-6">
            <div class="text-sm font-medium text-[#001740] mb-2">Latest Student Concern</div>
            <div
              v-if="latestConcern"
              class="flex items-start justify-between text-xs bg-gradient-to-r from-slate-50 via-slate-50 to-slate-100 border border-slate-100 rounded-xl px-3 py-2"
            >
              <!-- Left content: concern info -->
              <div class="mr-3 flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-0.5">
                  <span class="text-[10px] uppercase tracking-wide text-slate-400">Concern</span>
                </div>
                <div class="font-semibold text-slate-900 truncate">
                  {{ latestConcern.title || latestConcern.subject || 'No title provided' }}
                </div>
                <div class="text-slate-500 truncate">
                  {{ latestConcern.studentName || (latestConcern.student && latestConcern.student.name) || 'Unknown student' }}
                </div>
                <div class="text-[11px] text-slate-500 mt-0.5 truncate">
                  {{ latestConcern.message || latestConcern.description || latestConcern.details || 'No message provided' }}
                </div>
              </div>

              <!-- Right content: top-right status, bottom-right date/time -->
              <div class="flex flex-col justify-between items-end text-right flex-shrink-0 gap-2">
                <!-- Status chip (top-right) -->
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                  :class="latestConcernStatusClass(latestConcern)"
                >
                  {{ latestConcernStatusText(latestConcern) }}
                </span>

                <!-- Date + time (bottom-right) -->
                <div class="flex flex-col items-end gap-0.5">
                  <span class="text-[11px] font-medium text-[#102A71]">
                    {{ latestConcernDate(latestConcern) }}
                  </span>
                  <span class="text-[11px] text-slate-500">
                    {{ latestConcernTime(latestConcern) }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="text-xs text-slate-400">No concerns yet.</div>
          </div>
        </div>
      </div>

      <!-- Right column: Professor Availability + greeting banner -->
      <div class="flex flex-col gap-4 flex-1">
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-sm font-semibold tracking-[0.18em] text-[#001740] uppercase mb-3">Professor Availability</h3>
          <div class="space-y-4">
            <!-- Solid availability bar -->
            <div class="w-full h-4 rounded-full overflow-hidden bg-slate-100 flex">
              <div
                v-if="availability.availablePct > 0"
                class="h-full"
                :style="{
                  width: availability.availablePct + '%',
                  // Available: light green
                  backgroundColor: '#86efac'
                }"
              ></div>
              <div
                v-if="availability.busyPct > 0"
                class="h-full"
                :style="{
                  width: availability.busyPct + '%',
                  // Busy: yellow
                  backgroundColor: '#facc15'
                }"
              ></div>
              <div
                v-if="availability.notAvailablePct > 0"
                class="h-full"
                :style="{
                  width: availability.notAvailablePct + '%',
                  // Not available: red
                  backgroundColor: '#f97373'
                }"
              ></div>
            </div>
            <div class="grid grid-cols-3 gap-3">
              <!-- Available chip -->
              <div class="flex items-center justify-between rounded-lg px-3 py-2 text-xs bg-green-100 border border-green-300">
                <span class="font-medium text-green-800">Available</span>
                <span class="font-semibold text-green-900">
                  {{ availability.available }}
                  <span class="font-semibold"> ({{ availability.availablePct }}%)</span>
                </span>
              </div>

              <!-- Busy chip -->
              <div class="flex items-center justify-between rounded-lg px-3 py-2 text-xs bg-yellow-100 border border-yellow-300">
                <span class="font-medium text-yellow-800">Busy</span>
                <span class="font-semibold text-yellow-900">
                  {{ availability.busy }}
                  <span class="font-semibold"> ({{ availability.busyPct }}%)</span>
                </span>
              </div>

              <!-- Not Available chip -->
              <div class="flex items-center justify-between rounded-lg px-3 py-2 text-xs bg-red-100 border border-red-300">
                <span class="font-medium text-red-800">Not Available</span>
                <span class="font-semibold text-red-900">
                  {{ availability.notAvailable }}
                  <span class="font-semibold"> ({{ availability.notAvailablePct }}%)</span>
                </span>
              </div>
            </div>
            <div class="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Total professors: <span class="ml-1 normal-case tracking-normal font-normal text-slate-600">{{ availability.total }}</span>
            </div>
          </div>
        </div>

        <!-- Greeting banner -->
        <div class="shadow rounded-lg p-4 border border-slate-900/40 flex items-center justify-between bg-[#001740]">
          <!-- Left: greeting text -->
          <div class="mr-4 flex flex-col justify-center">
            <div>
              <h3 class="text-sm font-semibold tracking-[0.18em] text-white uppercase">{{ greetingMessage }}</h3>
              <p class="mt-1 text-[11px] text-slate-100/80">
                What would you like to focus on today?
              </p>
            </div>
          </div>

          <!-- Right: T2F logo -->
          <div class="flex items-center justify-center">
            <img
              src="/t2fLogogogo.svg"
              alt="Tap2Find"
              class="h-10 w-auto drop-shadow-sm"
            />
          </div>
        </div>

        <!-- Recent Activity card -->
        <div class="shadow rounded-lg p-6 border border-[#F5C400]/60 bg-[#F5C400] flex-1 flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-semibold tracking-[0.18em] text-[#001740] uppercase">Recent Activity</h3>
            <div class="text-right text-[11px] leading-tight text-[#3b2a00]">
              <div class="font-semibold">{{ currentDateLabel }}</div>
              <div class="text-[10px]">{{ currentTimeLabel }}</div>
            </div>
          </div>
          <div class="space-y-1 text-sm flex-1 flex items-center">
            <div class="w-full">
              <div v-if="todayOverviewMessages && todayOverviewMessages.length">
                <ul class="space-y-0.5">
                  <li
                    v-for="(msg, idx) in todayOverviewMessages.slice(0, 2)"
                    :key="idx"
                    class="text-[#3b2a00] truncate"
                  >
                    {{ msg }}
                  </li>
                </ul>
              </div>
              <div v-else class="text-[#3b2a00]">
                No new activity yet for today.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Close v-else wrapper -->
    </div>

    <!-- Today’s Overview modal -->
    <div
      v-if="showTodayOverviewModal"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black/40"
    >
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
        <div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 class="text-base font-semibold text-slate-900">Today’s Overview</h3>
          <button
            type="button"
            class="text-slate-500 hover:text-slate-700 text-sm"
            @click="showTodayOverviewModal = false"
          >
            Close
          </button>
        </div>
        <div class="px-5 py-4 max-h-72 overflow-y-auto text-sm">
          <ul class="space-y-2" v-if="todayOverviewMessages && todayOverviewMessages.length">
            <li
              v-for="(msg, idx) in todayOverviewMessages"
              :key="idx"
              class="px-3 py-2 rounded-lg bg-slate-50 text-slate-800"
            >
              {{ msg }}
            </li>
          </ul>
          <div v-else class="text-slate-500">
            No new activity yet for today.
          </div>
        </div>
        <div class="px-5 py-3 border-t border-slate-200 flex flex-wrap gap-2 justify-end">
          <router-link
            :to="{ name: 'admin-concerns' }"
            class="px-3 py-1.5 rounded-md bg-[#001740] text-white text-xs font-medium hover:bg-[#102A71] transition-colors"
            @click.native="showTodayOverviewModal = false"
          >
            Go to concerns
          </router-link>
          <router-link
            :to="{ name: 'admin-users' }"
            class="px-3 py-1.5 rounded-md bg-slate-100 text-slate-800 text-xs font-medium hover:bg-slate-200 transition-colors"
            @click.native="showTodayOverviewModal = false"
          >
            Go to students
          </router-link>
          <router-link
            :to="{ name: 'admin-professors' }"
            class="px-3 py-1.5 rounded-md bg-slate-100 text-slate-800 text-xs font-medium hover:bg-slate-200 transition-colors"
            @click.native="showTodayOverviewModal = false"
          >
            Go to professors
          </router-link>
        </div>
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
      concernsRefreshTimer: null,
      usersRefreshTimer: null,
      activityRefreshTimer: null,
      pollInterval: null, // Added for polling
      todayOverviewMessages: [],
      todayOverviewIndex: 0,
      showTodayOverviewModal: false,
      // Local tracking for latest student when backend has no timestamp
      latestStudentLocalTs: null,
      latestStudentLocalId: null,
    };
  },
  mounted() {
    this.initDashboard();
    // Auto-refresh concerns for the Daily Student Concerns chart and latest concern
    this.concernsRefreshTimer = setInterval(() => {
      this.fetchConcerns();
    }, 30000); // 30 seconds

    // Auto-refresh users so Recent Activity can pick up new registrations
    this.usersRefreshTimer = setInterval(() => {
      this.fetchUsers();
    }, 30000); // 30 seconds

    // Periodically recompute activity labels so "Xm ago" text stays current
    this.activityRefreshTimer = setInterval(() => {
      this.updateTodayOverviewMessages();
    }, 30000); // 30 seconds

    // Start 2-second polling for real-time updates
    this.startPolling();

    // Restore locally-tracked latest student timestamp from previous sessions
    try {
      const saved = localStorage.getItem('admin_latest_student_event');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.ts) {
          this.latestStudentLocalTs = parsed.ts;
          this.latestStudentLocalId = parsed.id || null;
        }
      }
    } catch (e) {
      console.error('Failed to restore latest student event from storage', e);
    }

    // Initialize Today's Overview once data starts coming in
    this.updateTodayOverviewMessages();
  },
  beforeDestroy() {
    if (this.concernsRefreshTimer) {
      clearInterval(this.concernsRefreshTimer);
      this.concernsRefreshTimer = null;
    }
    if (this.usersRefreshTimer) {
      clearInterval(this.usersRefreshTimer);
      this.usersRefreshTimer = null;
    }
    if (this.activityRefreshTimer) {
      clearInterval(this.activityRefreshTimer);
      this.activityRefreshTimer = null;
    }
    // Clean up polling interval
    this.stopPolling();
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
    latestConcern() {
      const list = Array.isArray(this.concerns) ? [...this.concerns] : []
      list.sort((a, b) => {
        const aDate = new Date(a.createdAt || a.timestamp || a.date || 0)
        const bDate = new Date(b.createdAt || b.timestamp || b.date || 0)
        return bDate - aDate
      })
      return list[0] || null
    },
    currentDayName() {
      const now = new Date();
      return now.toLocaleDateString(undefined, { weekday: 'long' });
    },
    currentDateLabel() {
      const now = new Date();
      return now.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' });
    },
    currentTimeLabel() {
      const now = new Date();
      return now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
    },
    greetingMessage() {
      const now = new Date();
      const hour = now.getHours();
      let part = 'Good day';
      if (hour < 12) part = 'Good morning';
      else if (hour < 18) part = 'Good afternoon';
      else part = 'Good evening';

      // Derive admin first name from the same localStorage data used in AdminLayout
      let firstName = 'Admin';
      try {
        const candidates = ['currentUser', 'user', 'admin'];
        let cached = null;
        for (const key of candidates) {
          const raw = localStorage.getItem(key);
          if (raw) {
            try {
              cached = JSON.parse(raw);
            } catch (e) {
              cached = null;
            }
          }
          if (cached) break;
        }
        if (cached) {
          const full = `${cached.firstName || ''} ${cached.lastName || ''}`.trim();
          const base = full || cached.emailAddress || 'Admin';
          firstName = String(base).trim().split(' ')[0] || 'Admin';
        }
      } catch (e) {
        firstName = 'Admin';
      }

      return `${part}, ${firstName}`;
    },
  },
  methods: {
    // ==============================
    // 🔹 Polling Functions (NEW)
    // ==============================
    startPolling() {
      // Clear any existing interval
      if (this.pollInterval) {
        clearInterval(this.pollInterval);
      }
      
      // Start new polling interval (2000ms = 2 seconds)
      this.pollInterval = setInterval(() => {
        this.fetchDashboardData();
      }, 2000);
      console.log('🔄 Started polling admin dashboard data every 2 seconds');
    },

    stopPolling() {
      if (this.pollInterval) {
        clearInterval(this.pollInterval);
        this.pollInterval = null;
        console.log('🛑 Stopped polling admin dashboard data');
      }
    },

    fetchDashboardData() {
      // Fetch all data that needs to be updated in real-time
      Promise.all([
        this.fetchDashboard(),
        this.fetchUsers(),
        this.fetchConcerns()
      ]);
    },

    async initDashboard() {
      this.loading = true;
      const start = Date.now();
      try {
        await Promise.all([
          this.fetchDashboard(),
          this.fetchUsers(),
          this.fetchConcerns(),
        ]);
      } finally {
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, 3000 - elapsed);
        setTimeout(() => {
          this.loading = false;
          // Start polling after initial load is complete
          this.startPolling();
        }, remaining);
      }
    },
    async fetchDashboard() {
      try {
        const res = await api.get("/admin/stats");
        this.stats = res.data.stats;
        this.updateTodayOverviewMessages();
      } catch (error) {
        console.error("Error polling dashboard stats:", error);
      }
    },
    async fetchUsers() {
      try {
        const res = await api.get("/admin/users");
        this.users = res.data.users;
        this.updateTodayOverviewMessages();
      } catch (error) {
        console.error("Error polling users:", error);
      }
    },
    async fetchConcerns() {
      try {
        const res = await api.get('/admin/concerns');
        this.concerns = res.data.concerns || [];
        this.updateTodayOverviewMessages();
      } catch (e) {
        console.error('Error polling concerns:', e);
      }
    },
    updateTodayOverviewMessages() {
      const events = [];

      // Latest concern created today
      const latest = this.latestConcern;
      if (latest) {
        const stamp = latest.createdAt || latest.timestamp || latest.date;
        if (stamp) {
          const d = new Date(stamp);
          if (!isNaN(d.getTime())) {
            const today = new Date();
            const sameDay =
              d.getFullYear() === today.getFullYear() &&
              d.getMonth() === today.getMonth() &&
              d.getDate() === today.getDate();
            if (sameDay) {
              const rel = this.formatRelativeTimeFromTimestamp(stamp);
              events.push({
                ts: d.getTime(),
                label: rel ? `New student concern logged · ${rel}` : 'New student concern logged'
              });
            }
          }
        }
      }

      // Most recent resolved concern today
      if (Array.isArray(this.concerns) && this.concerns.length > 0) {
        const resolvedToday = this.concerns
          .filter(c => {
            const status = (c.status || '').toLowerCase();
            if (status !== 'resolved') return false;
            const stamp = c.updatedAt || c.resolvedAt || c.createdAt || c.timestamp || c.date;
            if (!stamp) return false;
            const d = new Date(stamp);
            if (isNaN(d.getTime())) return false;
            const today = new Date();
            return (
              d.getFullYear() === today.getFullYear() &&
              d.getMonth() === today.getMonth() &&
              d.getDate() === today.getDate()
            );
          })
          .sort((a, b) => {
            const sa = a.updatedAt || a.resolvedAt || a.createdAt || a.timestamp || a.date || 0;
            const sb = b.updatedAt || b.resolvedAt || b.createdAt || b.timestamp || b.date || 0;
            return new Date(sb) - new Date(sa);
          });

        if (resolvedToday.length > 0) {
          const latestResolved = resolvedToday[0];
          const stamp = latestResolved.updatedAt || latestResolved.resolvedAt || latestResolved.createdAt || latestResolved.timestamp || latestResolved.date;
          const d = new Date(stamp);
          const rel = this.formatRelativeTimeFromTimestamp(stamp);
          events.push({
            ts: d.getTime(),
            label: rel ? `Student concern marked as resolved · ${rel}` : 'Student concern marked as resolved'
          });
        }
      }

      // Most recent archived concern today
      if (Array.isArray(this.concerns) && this.concerns.length > 0) {
        const archivedToday = this.concerns
          .filter(c => {
            const status = (c.status || '').toLowerCase();
            if (status !== 'archived') return false;
            const stamp = c.updatedAt || c.archivedAt || c.createdAt || c.timestamp || c.date;
            if (!stamp) return false;
            const d = new Date(stamp);
            if (isNaN(d.getTime())) return false;
            const today = new Date();
            return (
              d.getFullYear() === today.getFullYear() &&
              d.getMonth() === today.getMonth() &&
              d.getDate() === today.getDate()
            );
          })
          .sort((a, b) => {
            const sa = a.updatedAt || a.archivedAt || a.createdAt || a.timestamp || a.date || 0;
            const sb = b.updatedAt || b.archivedAt || b.createdAt || b.timestamp || b.date || 0;
            return new Date(sb) - new Date(sa);
          });

        if (archivedToday.length > 0) {
          const latestArchived = archivedToday[0];
          const stamp = latestArchived.updatedAt || latestArchived.archivedAt || latestArchived.createdAt || latestArchived.timestamp || latestArchived.date;
          const d = new Date(stamp);
          const rel = this.formatRelativeTimeFromTimestamp(stamp);
          events.push({
            ts: d.getTime(),
            label: rel ? `Student concern archived · ${rel}` : 'Student concern archived'
          });
        }
      }

      // Most recent student registered (preferably today)
      if (Array.isArray(this.users) && this.users.length > 0) {
        const studentsToday = this.users
          .filter(u => {
            const role = (u.role || '').toLowerCase();
            if (role && role !== 'student') return false;
            const stamp = u.createdAt || u.timestamp || u.date;
            // If there is no timestamp, still consider this student candidate
            // for a local "newly registered" event handled below.
            if (!stamp) return true;
            const d = new Date(stamp);
            if (isNaN(d.getTime())) return true;
            const today = new Date();
            return (
              d.getFullYear() === today.getFullYear() &&
              d.getMonth() === today.getMonth() &&
              d.getDate() === today.getDate()
            );
          })
          .sort((a, b) => {
            const sa = a.createdAt || a.timestamp || a.date || 0;
            const sb = b.createdAt || b.timestamp || b.date || 0;
            return new Date(sb) - new Date(sa);
          });

        if (studentsToday.length > 0) {
          const latestStudent = studentsToday[0];
          const rawStamp = latestStudent.createdAt || latestStudent.timestamp || latestStudent.date;
          if (rawStamp) {
            // Backend provided a timestamp: use it directly
            const d = new Date(rawStamp);
            if (!isNaN(d.getTime())) {
              const tsValue = d.getTime();
              const rel = this.formatRelativeTimeFromTimestamp(rawStamp);
              const label = rel ? `New student registered! · ${rel}` : 'New student registered!';
              events.push({
                ts: tsValue,
                label,
              });
            }
          } else {
            // No backend timestamp for this student: use a local one
            const id = latestStudent._id || latestStudent.id || null;
            let tsValue = this.latestStudentLocalTs;

            // If this is a different latest student, or we don't have a timestamp yet,
            // start counting from now and remember it
            if (!tsValue || (id && this.latestStudentLocalId !== id)) {
              tsValue = Date.now();
              this.latestStudentLocalTs = tsValue;
              this.latestStudentLocalId = id;
              try {
                localStorage.setItem('admin_latest_student_event', JSON.stringify({ ts: tsValue, id }));
              } catch (e) {
                console.error('Failed to persist latest student event', e);
              }
            }

            const rel = this.formatRelativeTimeFromTimestamp(tsValue);
            const label = rel ? `New student registered! · ${rel}` : 'New student registered!';
            events.push({
              ts: tsValue,
              label,
            });
          }
        }
      }

      // Sort all events by newest and keep all labels
      if (events.length > 0) {
        const sorted = [...events].sort((a, b) => b.ts - a.ts);
        this.todayOverviewMessages = sorted.map(ev => ev.label);
      } else {
        this.todayOverviewMessages = ['No new activity yet for today.'];
      }

      // Index is still used by modal navigation if needed
      this.todayOverviewIndex = 0;
    },
    formatRelativeTimeFromTimestamp(stamp) {
      if (!stamp) return '';
      const d = new Date(stamp);
      if (isNaN(d.getTime())) return '';
      const diffMs = Date.now() - d.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 60) {
        const sVal = diffSec <= 0 ? 1 : diffSec;
        return `${sVal}s ago`;
      }
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) {
        return `${diffMin}m ago`;
      }
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) {
        return `${diffHr}h ago`;
      }
      const diffDay = Math.floor(diffHr / 24);
      return `${diffDay}d ago`;
    },
    latestConcernStatusText(concern) {
      const raw = (concern && (concern.status || concern.state || concern.concernStatus || 'N/A')) || 'N/A';
      const s = String(raw).toLowerCase();
      if (!s) return 'N/A';
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
    latestConcernStatusClass(concern) {
      const raw = (concern && (concern.status || concern.state || concern.concernStatus || 'pending')) || 'pending';
      const s = String(raw).toLowerCase();
      if (s === 'resolved') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      if (s === 'archived') return 'bg-slate-100 text-slate-700 border-slate-200';
      if (s === 'in-progress' || s === 'ongoing') return 'bg-amber-50 text-amber-700 border-amber-200';
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    },
    latestConcernDate(concern) {
      const stamp = concern && (concern.createdAt || concern.timestamp || concern.date);
      if (!stamp) return '--';
      const d = new Date(stamp);
      if (isNaN(d.getTime())) return '--';
      const opts = { month: 'short', day: '2-digit', year: 'numeric' };
      return d.toLocaleDateString(undefined, opts);
    },
    latestConcernTime(concern) {
      const stamp = concern && (concern.createdAt || concern.timestamp || concern.date);
      if (!stamp) return '--:--';
      const d = new Date(stamp);
      if (isNaN(d.getTime())) return '--:--';
      const opts = { hour: 'numeric', minute: '2-digit', hour12: true };
      return d.toLocaleTimeString(undefined, opts);
    },
  }
};
</script>