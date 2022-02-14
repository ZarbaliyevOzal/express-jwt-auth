import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/index.css'
import router from './routes/index'
import store from './store/index'
import axios from './config/axios'

// set axios global
window.axios = axios


createApp(App)
  .use(router)
  .use(store)
  .mount('#app')
