import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import ApiService from '@/services/api'
import paginationService from '@/utils/pagination'

ApiService.init()

Vue.axios.interceptors.request.use(function (config) {
  store.commit('SET_LOADING_STATUS', true)
  return config
}, function (error) {
  store.commit('SET_LOADING_STATUS', false)
  return Promise.reject(error)
})

Vue.axios.interceptors.response.use(function ({ data }) {
  store.commit('SET_LOADING_STATUS', false)
  if (data.count) {
    const defaultPage = 1
    const page = paginationService.currentPage(data.next, data.previous) || defaultPage
    const next = paginationService.pageFromLink(data.next)
    const previous = paginationService.pageFromLink(data.previous)
    store.commit('SET_PAGINATION', {
      page,
      itemsPerPage: 5,
      count: data.count,
      next,
      previous,
      nextLink: data.next ? data.next.split('http://localhost')[1] : data.next,
      previousLink: data.previous
    })
    return data.results
  }
  return data
}, function (error) {
  store.commit('SET_LOADING_STATUS', false)
  if (error.response.status === 401) store.dispatch('user/LOGOUT')
  if (error || error.response.status === 400) ApiService.removeHeader()
  else router.replace('/?page=1')
  return Promise.reject(error)
})
