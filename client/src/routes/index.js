import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/home/Home.vue'
import SignIn from '../views/signin/SignIn.vue'
import SignUp from '../views/signup/SignUp.vue'
import store from '../store/index'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignIn
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  if (to.name !== 'SignIn' && to.name !== 'SignUp' && !isAuthenticated) next({ name: 'SignIn' })
  if ((to.name === 'SignIn' || to.name === 'SignUp') && isAuthenticated) next({ name: from.name ?? 'Home' })
  else next()
})

export default router;