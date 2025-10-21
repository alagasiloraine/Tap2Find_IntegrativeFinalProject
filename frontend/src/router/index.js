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

export default router
