<template>
  <div class="h-screen flex bg-slate-100 overflow-hidden p-4 gap-4">
    <!-- Sidebar -->
    <div class="hidden md:flex md:w-64 md:flex-col">
      <div class="flex flex-col flex-grow pt-5 bg-white text-slate-900 overflow-y-auto rounded-2xl shadow">
        <!-- Logo -->
        <div class="flex items-center justify-center flex-shrink-0 px-4 pb-4">
          <router-link to="/admin" class="flex flex-col items-center gap-2">
            <img src="/t2flogowhite.svg" alt="Tap2Find" class="h-12 w-auto" />
            <span class="text-lg font-extrabold tracking-wide text-[#001740] uppercase">
              Tap<span class="text-[#F5C400]">2</span>Find
            </span>
          </router-link>
        </div>
        <div class="border-t border-slate-200 mx-4 mb-3"></div>
        
        <!-- Navigation -->
        <div class="flex-grow flex flex-col">
          <nav class="flex-1 px-3 pb-6 space-y-5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            <!-- Overview section -->
            <div class="space-y-2">
              <p class="px-2">Overview</p>
              <router-link
                to="/admin"
                class="group flex items-center px-3 py-2 text-sm font-medium rounded-2xl transition-all duration-150"
                :class="$route.path === '/admin'
                  ? 'bg-[#001740] text-white shadow-md shadow-black/10'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-[#001740]'"
              >
                <span
                  class="mr-3 flex h-9 w-9 items-center justify-center rounded-full text-lg transition-colors duration-150"
                  :class="$route.path === '/admin'
                    ? 'bg-white/15 text-white'
                    : 'bg-slate-100 text-[#001740] group-hover:bg-slate-200 group-hover:text-[#001740]'"
                >
                  <LayoutDashboard class="w-4 h-4" />
                </span>
                Dashboard
              </router-link>
            </div>

            <!-- Management section -->
            <div class="space-y-2">
              <p class="px-2">Management</p>
              <!-- Users -->
              <router-link
                to="/admin/users"
                class="group flex items-center px-3 py-2 text-sm font-medium rounded-2xl transition-all duration-150"
                :class="$route.path.startsWith('/admin/users')
                  ? 'bg-[#001740] text-white shadow-md shadow-black/10'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-[#001740]'"
              >
                <span
                  class="mr-3 flex h-9 w-9 items-center justify-center rounded-full text-lg transition-colors duration-150"
                  :class="$route.path.startsWith('/admin/users')
                    ? 'bg-white/15 text-white'
                    : 'bg-slate-100 text-[#001740] group-hover:bg-slate-200 group-hover:text-[#001740]'"
                >
                  <Users class="w-4 h-4" />
                </span>
                Students
              </router-link>

              <!-- Professor Management -->
              <router-link
                to="/admin/professors"
                class="group flex items-center px-3 py-2 text-sm font-medium rounded-2xl transition-all duration-150"
                :class="$route.path.startsWith('/admin/professors')
                  ? 'bg-[#001740] text-white shadow-md shadow-black/10'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-[#001740]'"
              >
                <span
                  class="mr-3 flex h-9 w-9 items-center justify-center rounded-full text-lg transition-colors duration-150"
                  :class="$route.path.startsWith('/admin/professors')
                    ? 'bg-white/15 text-white'
                    : 'bg-slate-100 text-[#001740] group-hover:bg-slate-200 group-hover:text-[#001740]'"
                >
                  <GraduationCap class="w-4 h-4" />
                </span>
                Professors
              </router-link>

              <!-- Manage Student Concerns -->
              <router-link
                to="/admin/concerns"
                class="group flex items-center px-3 py-2 text-sm font-medium rounded-2xl transition-all duration-150"
                :class="$route.path.startsWith('/admin/concerns')
                  ? 'bg-[#001740] text-white shadow-md shadow-black/10'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-[#001740]'"
              >
                <span
                  class="mr-3 flex h-9 w-9 items-center justify-center rounded-full text-lg transition-colors duration-150"
                  :class="$route.path.startsWith('/admin/concerns')
                    ? 'bg-white/15 text-white'
                    : 'bg-slate-100 text-[#001740] group-hover:bg-slate-200 group-hover:text-[#001740]'"
                >
                  <MessagesSquare class="w-4 h-4" />
                </span>
                Concerns
              </router-link>
            </div>

            <!-- Activity section -->
            <div class="space-y-2">
              <p class="px-2">Activity</p>
              <router-link
                to="/admin/reports"
                class="group flex items-center px-3 py-2 text-sm font-medium rounded-2xl transition-all duration-150"
                :class="$route.path.startsWith('/admin/reports')
                  ? 'bg-[#001740] text-white shadow-md shadow-black/10'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-[#001740]'"
              >
                <span
                  class="mr-3 flex h-9 w-9 items-center justify-center rounded-full text-lg transition-colors duration-150"
                  :class="$route.path.startsWith('/admin/reports')
                    ? 'bg-white/15 text-white'
                    : 'bg-slate-100 text-[#001740] group-hover:bg-slate-200 group-hover:text-[#001740]'"
                >
                  <FileText class="w-4 h-4" />
                </span>
                Reports
              </router-link>
            </div>

          </nav>

          <!-- Logout button at bottom -->
          <div class="mt-auto px-3 pb-4">
            <button
              type="button"
              @click="showLogoutConfirm = true"
              class="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-2xl border border-slate-200 text-slate-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors duration-150"
            >
              <span>Log out</span>
            </button>
          </div>
        </div>
        
        <!-- User Profile (moved to top bar) -->
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col w-0 flex-1 overflow-hidden">
      <!-- Top Navigation -->
      <div class="relative z-10 flex-shrink-0 flex h-16 bg-white text-slate-900 shadow-sm rounded-2xl border border-slate-200">
        <!-- Mobile menu button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="px-4 border-r border-slate-200 text-slate-500 hover:text-admin-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-admin-accent md:hidden"
        >
          <span class="sr-only">Open sidebar</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <!-- Page title -->
        <div class="flex-1 px-4 flex justify-between items-center">
          <div class="flex-1 flex items-center gap-2">
            <div
              v-if="pageIcon"
              class="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-[#001740] mr-1"
            >
              <component :is="pageIcon" class="w-4 h-4" />
            </div>
            <h1 class="text-xs sm:text-sm md:text-base font-semibold uppercase tracking-[0.14em] text-[#001740]">
              {{ pageTitle }}
            </h1>
          </div>
          
          <!-- Right side actions -->
          <div class="ml-4 flex items-center md:ml-6 space-x-3">
            <!-- Notifications -->
            <button class="bg-slate-100 p-1 rounded-full text-slate-500 hover:text-[#001740] hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#001740] focus:ring-offset-white">
              <span class="sr-only">View notifications</span>
              <Bell class="w-4 h-4" />
            </button>

            <!-- Profile block: direct link to Admin Profile -->
            <router-link
              to="/admin/profile"
              class="ml-3 flex items-center space-x-2 sm:space-x-3 group px-2 py-1 rounded-full hover:bg-slate-50 transition-colors"
            >
              <div class="w-9 h-9 rounded-full overflow-hidden bg-[#E5ECFF] flex items-center justify-center ring-2 ring-[#001740]/10">
                <img v-if="adminPhotoUrl" :src="adminPhotoUrl" alt="Profile" class="w-full h-full object-cover" />
                <span v-else class="text-[#001740] text-sm font-semibold">{{ adminInitial }}</span>
              </div>
              <div class="hidden sm:flex flex-col text-left mr-1">
                <span class="text-sm font-medium text-slate-900 group-hover:text-[#001740]">{{ adminName }}</span>
                <span class="text-xs text-slate-500 truncate max-w-[160px]">{{ adminEmail || '-' }}</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Mobile sidebar -->
      <div v-if="mobileMenuOpen" class="md:hidden">
        <div class="fixed inset-0 flex z-40">
          <div class="fixed inset-0 bg-black/40" @click="mobileMenuOpen = false"></div>
          <div class="relative flex-1 flex flex-col max-w-xs w-full bg-admin-dark text-slate-100">
            <div class="absolute top-0 right-0 -mr-12 pt-2">
              <button
                @click="mobileMenuOpen = false"
                class="ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-admin-dark/80 text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-admin-accent"
              >
                <span class="sr-only">Close sidebar</span>
                <span class="text-white text-xl">×</span>
              </button>
            </div>
            <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div class="flex-shrink-0 flex items-center px-4">
                <span class="text-xl font-bold text-white">Tap2Find Admin</span>
              </div>
              <nav class="mt-5 px-3 space-y-1">
                <router-link
                  to="/admin"
                  class="group flex items-center px-3 py-2 text-base font-medium rounded-lg text-slate-100 hover:bg-white/10 hover:text-white"
                >
                  <span class="mr-4 text-lg">
                    <LayoutDashboard class="w-4 h-4" />
                  </span>
                  Dashboard
                </router-link>
                <router-link
                  to="/admin/users"
                  class="group flex items-center px-3 py-2 text-base font-medium rounded-lg text-slate-100 hover:bg-white/10 hover:text-white"
                >
                  <span class="mr-4 text-lg">
                    <Users class="w-4 h-4" />
                  </span>
                  Students
                </router-link>
                <router-link
                  to="/admin/professors"
                  class="group flex items-center px-3 py-2 text-base font-medium rounded-lg text-slate-100 hover:bg-white/10 hover:text-white"
                >
                  <span class="mr-4 text-lg">
                    <GraduationCap class="w-4 h-4" />
                  </span>
                  Professors
                </router-link>
                <router-link
                  to="/admin/concerns"
                  class="group flex items-center px-3 py-2 text-base font-medium rounded-lg text-slate-100 hover:bg-white/10 hover:text-white"
                >
                  <span class="mr-4 text-lg">
                    <MessagesSquare class="w-4 h-4" />
                  </span>
                  Concerns
                </router-link>
                <router-link
                  to="/admin/reports"
                  class="group flex items-center px-3 py-2 text-base font-medium rounded-lg text-slate-100 hover:bg-white/10 hover:text-white"
                >
                  <span class="mr-4 text-lg">
                    <FileText class="w-4 h-4" />
                  </span>
                  Reports
                </router-link>

                <!-- Mobile logout -->
                <button
                  type="button"
                  @click="showLogoutConfirm = true; mobileMenuOpen = false"
                  class="w-full flex items-center px-3 py-2 text-base font-medium rounded-lg text-red-200 hover:bg-white/10 hover:text-white mt-2"
                >
                  <span class="mr-4 text-lg">⏏</span>
                  Log out
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <!-- Page Content -->
      <main
        class="flex-1 relative focus:outline-none"
        :class="route.path === '/admin' ? 'overflow-y-hidden' : 'overflow-y-auto'"
      >
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-0">
            <router-view></router-view>
          </div>
        </div>
      </main>
    </div>
  </div>

  <!-- Logout confirmation modal -->
  <div
    v-if="showLogoutConfirm"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
  >
    <div class="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6 text-slate-900">
      <h2 class="text-lg font-semibold mb-2">Log out</h2>
      <p class="text-sm text-slate-600 mb-6">Are you sure you want to log out of your admin account?</p>
      <div class="flex justify-end gap-3">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
          @click="showLogoutConfirm = false"
        >
          Cancel
        </button>
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium rounded-xl bg-red-600 text-white hover:bg-red-700"
          @click="handleLogout"
        >
          Log out
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LayoutDashboard, Users, GraduationCap, MessagesSquare, FileText, Bell, ChevronDown } from 'lucide-vue-next'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const mobileMenuOpen = ref(false)
const showLogoutConfirm = ref(false)
const showProfileMenu = ref(false)
const profileMenuRef = ref(null)

const admin = ref(null)
const adminName = computed(() => {
  if (!admin.value) return 'Admin'
  const full = `${admin.value.firstName || ''} ${admin.value.lastName || ''}`.trim()
  return full || admin.value.emailAddress || 'Admin'
})

// Close profile dropdown when clicking outside
const handleDocumentClick = (event) => {
  const el = profileMenuRef.value
  if (!el) return
  if (!el.contains(event.target)) {
    showProfileMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
})
const adminFirstName = computed(() => admin.value?.firstName || (adminName.value.split(' ')[0] || 'Admin'))
const adminEmail = computed(() => admin.value?.emailAddress || '')
const adminInitial = computed(() => {
  const a = admin.value
  if (!a) return (adminName.value.replace(/[^A-Za-z]/g, '').slice(0, 2) || 'A').toUpperCase()

  const first = String(a.firstName || '').trim()
  const last = String(a.lastName || '').trim()
  const f = first.charAt(0)
  const l = last.charAt(0)
  const base = (f + l) || (adminName.value.replace(/[^A-Za-z]/g, '').slice(0, 2)) || 'A'
  return base.toUpperCase()
})
const adminPhotoUrl = computed(() => {
  const a = admin.value
  if (a && a.photoBase64 && a.photoMime) {
    return `data:${a.photoMime};base64,${a.photoBase64}` 
  }
  return ''
})

// Make adminFirstName available to child views (e.g., Dashboard greeting)
provide('adminFirstName', adminFirstName)

onMounted(async () => {
  try {
    const candidates = ['currentUser', 'user', 'admin']
    let cached = null
    for (const key of candidates) {
      const raw = localStorage.getItem(key)
      if (raw) {
        try { cached = JSON.parse(raw) } catch {}
      }
      if (cached) break
    }
    if (cached) {
      admin.value = cached
      const id = cached._id || cached.id
      if (id) {
        try {
          const res = await axios.get(`/admin/users/${id}`)
          if (res.data?.user) admin.value = res.data.user
        } catch {}
      }
    }
  } catch {}
})

const pageTitle = computed(() => {
  if (route.path.startsWith('/admin/users')) return 'Students'
  if (route.path.startsWith('/admin/professors')) return 'Professors'
  if (route.path.startsWith('/admin/concerns')) return 'Concerns'
  if (route.path.startsWith('/admin/reports')) return 'Reports'
  if (route.path.startsWith('/admin/profile')) return 'Admin Profile'
  if (route.path === '/admin') return 'Dashboard'
  return 'Admin Panel'
})

const pageIcon = computed(() => {
  if (route.path.startsWith('/admin/users')) return Users
  if (route.path.startsWith('/admin/professors')) return GraduationCap
  if (route.path.startsWith('/admin/concerns')) return MessagesSquare
  if (route.path.startsWith('/admin/reports')) return FileText
  if (route.path.startsWith('/admin/profile')) return Users
  if (route.path === '/admin') return LayoutDashboard
  return null
})

const handleLogout = () => {
  // Clear session-related data
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('user')
  localStorage.removeItem('admin')
  localStorage.removeItem('currentUser')

  showLogoutConfirm.value = false

  router.push('/login')
}

const openLogoutConfirm = () => {
  showProfileMenu.value = false
  showLogoutConfirm.value = true
}
</script>