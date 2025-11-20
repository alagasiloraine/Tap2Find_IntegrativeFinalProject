import AdminLayout from '@/layouts/AdminLayout.vue'
import Dashboard from '@/views/admin/Dashboard.vue'
import ManageUsers from '@/views/admin/ManageUsers.vue'
import ProfessorManagement from '@/views/admin/ProfessorManagement.vue'
import ManageStudentConcerns from '@/views/admin/ManageStudentConcerns.vue'
import GenerateReports from '@/views/admin/GenerateReports.vue'
import AdminProfile from '@/views/admin/AdminProfile.vue'

const Placeholder = (title) => ({
  template: `<div class="p-4"><h1 class="text-2xl font-semibold text-gray-900">${title}</h1><p class="mt-2 text-gray-600">Content coming soon.</p></div>`
})

const adminRoutes = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: Dashboard,
        meta: { requiresAuth: true, role: 'admin' }
      },
      {
        path: 'users',
        name: 'admin-users',
        component: ManageUsers,
        meta: { requiresAuth: true, role: 'admin' }
      },
      {
        path: 'professors',
        name: 'admin-professors',
        component: ProfessorManagement,
        meta: { requiresAuth: true, role: 'admin' }
      },
      {
        path: 'concerns',
        name: 'admin-concerns',
        component: ManageStudentConcerns,
        meta: { requiresAuth: true, role: 'admin' }
      },
      {
        path: 'reports',
        name: 'admin-reports',
        component: GenerateReports,
        meta: { requiresAuth: true, role: 'admin' }
      },
      {
        path: 'profile',
        name: 'admin-profile',
        component: AdminProfile,
        meta: { requiresAuth: true, role: 'admin' }
      }
    ],
  },
]

export default adminRoutes