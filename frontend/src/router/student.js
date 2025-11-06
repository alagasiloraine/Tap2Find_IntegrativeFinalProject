import StudentLayout from '@/layouts/StudentLayout.vue'
import Dashboard from '@/views/student/StudentDashboard.vue'
import LocateProfessor from '@/views/student/LocateProfessor.vue'
import Notifications from '@/views/student/Notifications.vue'
import Profile from '@/views/student/Profile.vue'
// import Messages from '@/views/student/Messages.vue'

const studentRoutes = [
  {
    path: '/student',
    component: StudentLayout,
    meta: { requiresAuth: true, role: 'student' }, // ✅ added here
    children: [
      {
        path: '',
        redirect: '/student/dashboard'
      },
      {
        path: 'dashboard',
        name: 'student-dashboard',
        component: Dashboard,
      },
      {
        path: 'locate-professor',
        name: 'student-locate-professor',
        component: LocateProfessor,
      },
      {
        path: 'notifications',
        name: 'student-notifications',
        component: Notifications,
      },
      {
        path: 'profile',
        name: 'student-profile',
        component: Profile,
      },
      // {
      //   path: 'messages',
      //   name: 'student-messages',
      //   component: Messages,
      // }
    ],
  },
]

export default studentRoutes
