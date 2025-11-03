import { createRouter, createWebHistory } from 'vue-router'
import landingRoutes from '@/router/landing.js'
import authRoutes from '@/router/auth.js'
import adminRoutes from '@/router/admin.js'
import professorRoutes from '@/router/professor.js'
import studentRoutes from '@/router/student.js'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Landing routes
    ...landingRoutes,
    // Auth routes
    ...authRoutes,
    // Admin routes
    ...adminRoutes,
    // Professor routes
    ...professorRoutes,
    // Student routes
    ...studentRoutes,
  ],
})

// ✅ Navigation Guard (Middleware)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('role')

  const clearSession = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('user')
  }

  // Check if the route needs authentication
  const requiresAuth = to.matched.some(record => record.meta?.requiresAuth)

  // 🧩 If route requires login but no token
  if (requiresAuth && !token) {
    clearSession()
    return next('/login')
  }

  // 👮 If route has role restrictions
  const requiredRoles = to.matched
    .filter(record => record.meta?.role)
    .map(record => record.meta.role)

  // ⚙️ Allow login process to complete first before redirect
  // If the route has a required role but we don't yet have one, skip check temporarily
  if (requiredRoles.length > 0) {
    if (!userRole) {
      // Let first-time navigation after login finish
      return next()
    }

    // If user role does not match required role
    if (!requiredRoles.includes(userRole)) {
      clearSession()
      return next('/unauthorized')
    }
  }

  // Allow visiting /login and /register even if already authenticated

  return next()
})

export default router
