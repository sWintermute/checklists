import Vue from 'vue'
import router from '@/router'
import ApiService from '@/services/api.js'
import tokenService from '@/services/tokenService.js'

export default {
  PROFILE ({ commit }) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING_STATUS', true)
      ApiService.setHeader()
      return ApiService.get('api/users/me')
        .then(({ data }) => {
          commit('SET_USER', data)
          commit('SET_LOADING_STATUS', false)
          resolve(data)
        }).catch(error => {
          console.log(error.response)
          reject(error)
        })
    })
  },
  LOGIN ({ commit }, user) {
    return new Promise((resolve, reject) => {
      ApiService.removeHeader()
      commit('SET_LOADING_STATUS', true)
      ApiService.post('api/auth/token/login', user)
        .then((response) => {
          tokenService.saveToken(response.data["auth_token"])
          commit('SET_AUTH_TOKEN', response.data["auth_token"])
          commit('SET_AUTH_SUCCESS')
          router.push('/profile')
          resolve(response)
        })
        .catch((error) => {
          Vue.$toast.open({
            message: [
              'Невозможно войти с предоставленными учетными данными.',
              'Статус: ' + error.response.status].join(' '),
            type: 'error'
          })
          console.log({ error })
          reject(error)
        })
        .finally(() => {
          commit('SET_LOADING_STATUS', false)
        })
    })
  },
  LOGOUT ({ commit }) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader()
      commit('SET_LOADING_STATUS', true)
      ApiService.post('api/auth/token/logout')
        .then((response) => {
          ApiService.removeHeader()
          commit('SET_LOGOUT')
          resolve()
        })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
        .finally(() => {
          commit('SET_LOADING_STATUS', false)
          tokenService.destroyToken()
        })
    })
  }
}
