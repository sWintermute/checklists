import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import TokenService from './tokenService'
import { BASE_URL } from './config'

const ApiService = {
  init () {
    Vue.use(VueAxios, axios)
    Vue.axios.defaults.baseURL = BASE_URL
  },
  setHeader (dadataToken = '') {
    const authToken = TokenService.getToken()
    Vue.axios.defaults.headers.common.Authorization = `Token ${ dadataToken ? dadataToken : authToken }`
  },
  removeHeader () {
    Vue.axios.defaults.headers.common.Authorization = null
  },
  get (resource, id = '', payload) {
    return Vue.axios.get(`${resource}${id ? '/' + id + '/' : ''}`, payload || {})
  },
  post (resource, params) {
    return Vue.axios.post(`${resource}/`, params)
  },
  delete (resource, id = '') {
    return Vue.axios.delete(`${resource}/${id ? id + '/' : ''}`)
  },
  put (resource, id = '', payload) {
    return Vue.axios.put(`${resource}/${id ? `${ id }/` : ''}`, payload)
  }
}

export default ApiService
