import ProfessorLayout from '@/layouts/ProfessorLayout.vue'
import Dashboard from '@/views/professor/Dashboard.vue'

const professorRoutes = [
  {
    path: '/professor',
    component: ProfessorLayout,
    children: [
      {
        path: '',
        name: 'professor-dashboard',
        component: Dashboard,
      },
    ],
  },
]

export default professorRoutes
