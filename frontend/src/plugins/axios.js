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
    store.dispatch('user/LOGOUT')
  } else {
    router.push('/')
  }
  // if (error.response.config.url.endsWith('login/')) {}
  return Promise.reject(error)
})
