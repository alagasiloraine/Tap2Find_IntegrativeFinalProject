import StudentLayout from '@/layouts/StudentLayout.vue'
import Dashboard from '@/views/student/Dashboard.vue'
import LocateProfessor from '@/views/student/LocateProfessor.vue'
import Messages from '@/views/student/Messages.vue'
import Notifications from '@/views/student/Notifications.vue'
import Profile from '@/views/student/Profile.vue'

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
        path: 'messages',
        name: 'student-messages',
        component: Messages,
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
    ],
  },
]

export default studentRoutes
