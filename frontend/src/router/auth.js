import AuthLayout from '@/layouts/AuthLayout.vue'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import VerifyEmail from '@/views/auth/VerifyEmail.vue'

const authRoutes = [
  {
    path: '/auth/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'login',
        name: 'login',
        component: Login,
      },
    ],
  },
  {
    path: '/auth/register',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'register',
        name: 'register',
        component: Register,
      },
    ],
  },
  {
    path: '/forgot-password',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'forgot-password',
        name: 'forgot-password',
        component: ForgotPassword,
      },
    ],
  },
  {
    path: '/:random/verify-email',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'verify-email',
        component: VerifyEmail,
      },
    ],
  },
]

export default authRoutes
