import AuthLayout from '@/layouts/AuthLayout.vue'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import VerifyEmail from '@/views/auth/VerifyEmail.vue'

const authRoutes = [
  {
    path: '/login',
    name: 'login',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: Login,
      },
    ],
  },
  {
    path: '/register',
    name: 'register',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: Register,
      },
    ],
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: ForgotPassword,
      },
    ],
  },
  {
    path: '/verify-email',
    name: 'verify-email',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: VerifyEmail,
      },
    ],
  },
]

export default authRoutes
