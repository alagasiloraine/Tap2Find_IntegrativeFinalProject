import StudentLayout from '@/layouts/StudentLayout.vue'
import Dashboard from '@/views/student/StudentDashboard.vue'
import LocateProfessor from '@/views/student/LocateProfessor.vue'
import Notifications from '@/views/student/Notifications.vue'
import Profile from '@/views/student/Profile.vue'
import StudentSettings from '@/views/student/StudentSettings.vue'
import StudentSupportAbout from '@/views/student/StudentSupportAbout.vue'

const studentRoutes = [
  {
    path: '/student',
    component: StudentLayout,
    meta: { requiresAuth: true, role: 'student' },
    children: [
      {
        path: '',
        redirect: '/student/dashboard',
        meta: { requiresAuth: true, role: 'student' },
      },
      {
        path: 'dashboard',
        name: 'student-dashboard',
        component: Dashboard,
        meta: { requiresAuth: true, role: 'student' },
      },
      {
        path: 'locate-professor',
        name: 'student-locate-professor',
        component: LocateProfessor,
        meta: { requiresAuth: true, role: 'student' },
      },
      {
        path: 'notifications',
        name: 'student-notifications',
        component: Notifications,
        meta: { requiresAuth: true, role: 'student' },
      },
      {
        path: 'profile',
        name: 'student-profile',
        component: Profile,
        meta: { requiresAuth: true, role: 'student' },
      },
      {
        path: 'settings',
        name: 'student-settings',
        component: StudentSettings,
        meta: { requiresAuth: true, role: 'student' },
      },
      {
        path: 'support',
        name: 'student-support-about',
        component: StudentSupportAbout,
        meta: { requiresAuth: true, role: 'student' },
      },
    ],
  },
]

export default studentRoutes
