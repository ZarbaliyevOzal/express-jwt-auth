import axios from 'axios'
import store from '../store/index'
import router from '../routes/index'

const instance = axios.create({
  baseURL: 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json'
  }
})

instance.interceptors.request.use(
  function(config) {
    const accessToken = store.getters['auth/accessToken']
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  async function(err) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    
    // console.log('config', err.config)

    const originalRequest = err.config
    
    if (err.response.status === 401 && originalRequest.url.includes('/token')) {
      store.dispatch('removeAuth')
      router.push({ name: 'SignIn' })
      return Promise.reject(error)
    } else if (err.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      await store.dispatch('auth/refreshToken')
      return instance(originalRequest)
    }

    return Promise.reject(err)
  }
)

export default instance