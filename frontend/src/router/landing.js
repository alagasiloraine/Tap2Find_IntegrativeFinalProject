import LandingLayout from '@/layouts/LandingLayout.vue'
import Home from '@/views/landing/Home.vue'
import About from '@/views/landing/About.vue'

const landingRoutes = [
  {
    path: '/',
    component: LandingLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: Home,
      },
      {
        path: 'about',
        name: 'about',
        component: About,
      },
    ],
  },
]

export default landingRoutes
