import Vue from 'vue'
import router from '@/router'
import tokenService from '@/services/client/tokenService.js'
import types from '@/store/types'
import injector from 'vue-inject'

import { $axios } from '@/services/constants'

export default {
  async [types.PROFILE] ({ commit }, { vm }) {
    try {
      const { data: user } = await vm.$repositories.users.get()
      commit('SET_USER', user)
    } catch (error) {
      console.log(error.response)
    }
  },
  async [types.LOGIN] ({ commit }, { vm, user }) {
    try {
      const { data } = await vm.$repositories.users.login(user)
      const { auth_token: authToken } = data
      tokenService.saveToken(authToken)
      $axios.setToken(authToken, 'Token')
      commit('SET_AUTH_TOKEN', authToken)
      commit('SET_AUTH_SUCCESS')
      router.push('/profile')
    } catch ({ response }) {
      Vue.$toast.open({
        message: [
          'Невозможно войти с предоставленными учетными данными.',
          'Статус: ' + response.status].join(' '),
        type: 'error'
      })
    }
  },
  [types.LOGOUT]: injector.encase([ '$repositories' ], ($repositories) => async ({ commit }) => {
    try {
      const token = tokenService.getToken()
      if (token) {
        await $repositories.users.logout('api/auth/token/logout')
      }
      commit('SET_LOGOUT')
      tokenService.destroyToken()
      router.push('/login')
    } catch (error) {
      console.log(error)
    }
  })
}
