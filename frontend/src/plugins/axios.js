import client from '@/services/client/api'
import store from '@/store'
import tokenService from '@/services/client/tokenService.js'
import { $axios } from '@/services/constants'


let loadFunction = config => {
  store.commit('SET_LOADING_STATUS', true)
  const authToken = tokenService.getToken()
  if (authToken) {
    config.headers['Authorization'] = `Token ${ authToken }`;
  }
  console.log(config)
  return config
}

let finishFunction = response => {
  store.commit('SET_LOADING_STATUS', false)
  return response
}

// let errorFunction = error => {
//   store.commit('SET_LOADING_STATUS', false)
//   return Promise.reject(error)
// }

client.interceptors.request.use(loadFunction)
// client.interceptors.response.use(finishFunction, errorFunction)

client.interceptors.response.use(
  finishFunction, 
  error => {
    return new Promise(function (resolve, reject) {
      store.commit('SET_LOADING_STATUS', false)
      if (error.response.status === 401 && error.config && !error.config.__isRetryRequest) {
        store.dispatch('LOGOUT')
        client.setToken()
      }
      throw error
    })
  }
)

client.setHeader = (name, value, scopes = 'common') => {
  for (let scope of Array.isArray(scopes) ? scopes : [ scopes ]) {
    if (!value) {
      delete client.defaults.headers[scope][name];
      return
    }
    client.defaults.headers[scope][name] = value
  }
}

client.setToken = (token, type, scopes = 'common') => {
  const value = !token ? null : (type ? type + ' ' : '') + token
  client.setHeader('Authorization', value, scopes)
}

export default client