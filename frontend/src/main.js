import { createApp } from 'vue'
import '@/assets/main.css'
import '@/plugins/iconify.js'

import App from '@/App.vue'
import router from '@/router'

console.log('Vue app is starting...')

const app = createApp(App)
app.use(router)
app.mount('#app')

console.log('Vue app mounted!')

