import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import ApiService from '@/services/api'

ApiService.init()

Vue.axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  // console.log(config)
  store.commit('SET_LOADING_STATUS', true);
  return config;
}, function (error) {
  // Do something with request error
  store.commit('SET_LOADING_STATUS', false);
  return Promise.reject(error);
});

Vue.axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  store.commit('SET_LOADING_STATUS', false);
  return response
}, function (error) {
  store.commit('SET_LOADING_STATUS', false);
  if (error.response.status === 401) {
    store.dispatch('user/LOGOUT')
  } else {
    router.push('/')
  }
  // if (error.response.config.url.endsWith('login/')) {}
  return Promise.reject(error)
})
