import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import ApiService from '@/services/api'

ApiService.init()

Vue.axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, function (error) {
  if (error.response.status === 401) {
    console.log({ error })
    this.commit('SET_LOADING_STATUS', false)
    router.replace('/login')
  } else {
    router.replace('/')
  }
  return Promise.reject(error)
})
