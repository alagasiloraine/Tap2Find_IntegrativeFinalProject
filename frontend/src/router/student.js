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
      {
        path: 'settings',
        name: 'student-settings',
        component: StudentSettings,
      },
      {
        path: 'support',
        name: 'student-support-about',
        component: StudentSupportAbout,
      },
    ],
  },
]

export default studentRoutes
