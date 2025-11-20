import LandingLayout from '@/layouts/LandingLayout.vue'
import Home from '@/views/landing/Home.vue'
import About from '@/views/landing/About.vue'
import Features from '@/views/landing/Features.vue'
import Contact from '@/views/landing/Contact.vue'
import Unauthorized from '@/views/error/Unauthorized.vue'

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
      {
        path: 'features',
        name: 'features',
        component: Features,
      },
      {
        path: 'contact',
        name: 'contact',
        component: Contact,
      },
    ],
  },
   {
        path: '/unauthorized',
        name: 'unauthorized',
        component: Unauthorized,
  }
]

export default landingRoutes
