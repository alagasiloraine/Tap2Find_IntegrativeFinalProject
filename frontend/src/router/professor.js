import ProfessorLayout from '@/layouts/ProfessorLayout.vue'
import ProfessorDashboard from '@/views/professor/ProfessorDashboard.vue'
import SetAvailabilityStatus from '@/views/professor/SetAvailabilityStatus.vue'
import ManageStudentConcerns from '@/views/professor/ManageStudentConcerns.vue'
import TeachingSchedule from '@/views/professor/TeachingSchedule.vue'
import ProfessorProfile from '@/views/professor/ProfessorProfile.vue'
import ProfessorNotifications from '@/views/professor/ProfessorNotifications.vue'

const professorRoutes = [
  {
    path: '/professor',
    component: ProfessorLayout,
    meta: { requiresAuth: true, role: 'professor' }, // ✅ added here
    children: [
      {
        path: '',
        name: 'professor-dashboard',
        component: ProfessorDashboard,
      },
      {
        path: 'availability',
        name: 'professor-availability',
        component: SetAvailabilityStatus,
      },
      {
        path: 'concerns',
        name: 'professor-concerns',
        component: ManageStudentConcerns,
      },
      {
        path: 'schedule',
        name: 'professor-schedule',
        component: TeachingSchedule,
      },
      {
        path: 'notifications',
        name: 'professor-notifications',
        component: ProfessorNotifications,
      },
      {
        path: 'profile',
        name: 'professor-profile',
        component: ProfessorProfile,
      },
    ],
  },
]

export default professorRoutes
