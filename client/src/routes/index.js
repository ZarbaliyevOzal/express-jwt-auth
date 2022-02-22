import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/home/Home.vue'
import Profile from '../views/profile/Profile.vue'
import SignIn from '../views/signin/SignIn.vue'
import SignUp from '../views/signup/SignUp.vue'
import ForgotPassword from '../views/auth/ForgotPassword.vue'
import ResetPassword from '../views/auth/ResetPassword.vue'
import store from '../store/index'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      auth: true
    }
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
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/password-reset/:token',
    name: 'ResetPassword',
    component: ResetPassword
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  const authRoutes = ['SignIn', 'SignUp', 'ForgotPassword']
  if (authRoutes.indexOf(to.name) > -1 && isAuthenticated) return next({ name: 'Home' })
  if (!isAuthenticated && to.meta?.auth) return next({ name: 'SignIn' })
  return next()
})

export default router;