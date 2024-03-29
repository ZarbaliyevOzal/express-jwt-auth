import { parseJwt } from '../../helpers/index'
import { useToast } from 'vue-toastification'

const toast = useToast()

const Auth = {
  namespaced: true,
  state: () => ({
    accessToken: localStorage.getItem('accessToken') ?? null,
    refreshToken: localStorage.getItem('refreshToken') ?? null
  }),
  mutations: {
    LOGOUT: (state) => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      state.accessToken = null
      state.refreshToken = null
    },
    SET_ACCESS_TOKEN: (state, payload) => {
      localStorage.setItem('accessToken', payload)
      state.accessToken = payload
    },
    SET_REFRESH_TOKEN: (state, payload) => {
      localStorage.setItem('refreshToken', payload)
      state.refreshToken = payload
    }
  },
  actions: {
    login: ({ commit }, payload) => 
      new Promise((resolve, reject) => {
        axios.post('/api/v1/login', payload)
          .then((res) => {
            commit('SET_ACCESS_TOKEN', res.data.accessToken)
            commit('SET_REFRESH_TOKEN', res.data.refreshToken)
            resolve(res.data)
          })
          .catch((err) => reject(err))
      }),
    logout: ({ commit }) => 
      new Promise((resolve) => {
        commit('LOGOUT')
        resolve()
      }),
    refreshToken: ({ commit, state }) =>
      new Promise((resolve, reject) => {
        axios.post('/api/v1/token', { token: state.refreshToken })
          .then((res) => {
            commit('SET_ACCESS_TOKEN', res.data.accessToken)
            commit('SET_REFRESH_TOKEN', res.data.refreshToken)
            resolve(res)
          })
          .catch((err) => reject(err))
      }),
    signup: ({ commit }, payload) =>
      new Promise((resolve, reject) => {
        axios.post('/api/v1/signup', payload)
          .then((res) => {
            commit('SET_ACCESS_TOKEN', res.data.accessToken)
            commit('SET_REFRESH_TOKEN', res.data.refreshToken)
            // success notification
            toast.success(res.data.message)
            resolve(res.data)
          })
          .catch((err) => {
            toast.warning(err.response.data.message)
            reject(err)
          })
      }),
    forgotPassword: (_, payload) => 
      new Promise((resolve, reject) => {
        axios.post('/api/v1/password-reset', payload)
          .then((res) => {
            toast.success(res.data.message)
            resolve(res.data)
          })
          .catch((err) => {
            toast.warning(err.response.data.message)
            reject(err)
          })
      }),
    passwordReset: (_, payload) =>
      new Promise((resolve, reject) => {
        const { password, password_confirmation } = payload
        axios.post(`/api/v1/password-reset/${payload.token}`, { password, password_confirmation })
          .then((res) => {
            toast.success(res.data.message)
            resolve(res.data)
          })
          .catch((err) => {
            toast.warning(err.response.data.message)
            reject(err)
          })
      }),
    resendVerificationLink: () =>
      new Promise((resolve, reject) => {
        axios.post('/api/v1/resend-verification-link')
          .then((res) => {
            toast.success(res.data.message)
            resolve(res.data)
          })
          .catch((err) => {
            toast.warning(err.response.data.message)
            reject(err)
          })
      })
  },
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    accessToken: (state) => state.accessToken,
    refreshToken: (state) => state.refreshToken,
    decodedAccessToken: (state) => state.accessToken ? parseJwt(state.accessToken) : null
  }
}

export default Auth;