import Vue from 'vue'
import router from '@/router'
import ApiService from '@/services/api.js'
import tokenService from '@/services/tokenService.js'

export default {
  async PROFILE ({ commit }) {
    try {
      ApiService.setHeader()
      const data = await ApiService.get('api/users/me')
      commit('SET_USER', data)
    } catch (error) {
      console.log(error.response, 123)
    }
  },
  async LOGIN ({ commit }, user) {
    try {
      ApiService.removeHeader()
      const data = await ApiService.post('api/auth/token/login', user)
      console.log(data)
      tokenService.saveToken(data.auth_token)
      commit('SET_AUTH_TOKEN', data.auth_token)
      router.push('/profile')
    } catch (error) {
      Vue.$toast.open({
        message: 'Невозможно войти с предоставленными учетными данными.',
        type: 'error'
      })
      console.log({error})
    }
  },
  async LOGOUT ({ commit }) {
    try {
      this.commit('SET_LOADING_STATUS', true)
      commit('SET_LOGOUT')
      ApiService.removeHeader()
      tokenService.destroyToken()
      router.push('/login')
      this.commit('SET_LOADING_STATUS', false)
    } catch (error) {
      console.log(error)
    }
  }
}
