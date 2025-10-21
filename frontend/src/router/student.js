import StudentLayout from '@/layouts/StudentLayout.vue'
import Home from '@/views/student/Home.vue'

const studentRoutes = [
  {
    path: '/student',
    component: StudentLayout,
    children: [
      {
        path: '',
        name: 'student-home',
        component: Home,
      },
    ],
  },
]

export default studentRoutes
