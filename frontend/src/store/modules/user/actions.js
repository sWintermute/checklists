import Vue from 'vue'
import router from '@/router'
import ApiService from '@/services/client/api.js'
import tokenService from '@/services/client/tokenService.js'
import types from '@/store/types'

export default {
  [types.PROFILE] ({ commit }) {
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
  async [types.LOGIN] ({ commit }, { vm, user }) {
    try {
      const { data } = await vm.$repositories.users.login(user)
      const { authToken } = data
      tokenService.saveToken(authToken)
      commit('SET_AUTH_TOKEN', authToken)
      commit('SET_AUTH_SUCCESS')
      router.push('/profile')
    } catch (error) {
      // Vue.$toast.open({
      //   message: [
      //     'Невозможно войти с предоставленными учетными данными.',
      //     'Статус: ' + error.response.status].join(' '),
      //   type: 'error'
      // })
      console.log({ error })
    }
  },
  async [types.LOGOUT] ({ commit }, { vm }) {
    try {
      console.log(this._vm.$repositories)
      await vm.$repositories.users.logout('api/auth/token/logout')
      commit('SET_LOGOUT')
      tokenService.destroyToken()
      router.push('/login')
    } catch (error) {
      console.log(error)
    }
  }
}
