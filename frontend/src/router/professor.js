import ProfessorLayout from '@/layouts/ProfessorLayout.vue'
import ProfessorDashboard from '@/views/professor/ProfessorDashboard.vue'
import SetAvailabilityStatus from '@/views/professor/SetAvailabilityStatus.vue'
import ManageStudentConcerns from '@/views/professor/ManageStudentConcerns.vue'
import TeachingSchedule from '@/views/professor/TeachingSchedule.vue'
import ProfessorProfile from '@/views/professor/ProfessorProfile.vue'
import ProfessorNotifications from '@/views/professor/ProfessorNotifications.vue'
import ProfessorSettings from '@/views/professor/ProfessorSettings.vue'
import ProfessorSupportAbout from '@/views/professor/ProfessorSupportAbout.vue'
import TapCardStep from '@/components/availability/TapCardStep.vue'
import SetStatusStep from '@/components/availability/SetStatusStep.vue'
import ActivityPanelStep from '@/components/availability/ActivityPanelStep.vue'

const professorRoutes = [
  {
    path: '/professor',
    component: ProfessorLayout,
    meta: { requiresAuth: true, role: 'professor' },
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
        children: [
          {
            path: '',
            redirect: { name: 'professor-availability-tap' },
          },
          {
            path: 'tap',
            name: 'professor-availability-tap',
            component: TapCardStep,
          },
          {
            path: 'status',
            name: 'professor-availability-status',
            component: SetStatusStep,
          },
          {
            path: 'activity',
            name: 'professor-availability-activity',
            component: ActivityPanelStep,
          },
        ],
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
        path: 'settings',
        name: 'professor-settings',
        component: ProfessorSettings,
      },
      {
        path: 'support',
        name: 'professor-support',
        component: ProfessorSupportAbout,
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