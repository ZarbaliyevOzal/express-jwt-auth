import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/index.css'
import router from './routes/index'
import store from './store/index'
import axios from './config/axios'
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

// set axios global
window.axios = axios


createApp(App)
  .use(router)
  .use(store)
  .use(Toast)
  .mount('#app')