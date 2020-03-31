import client from '@/services/client/api'
import store from '@/store'


let loadFunction = config => {
  store.commit('SET_LOADING_STATUS', true)
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
      if (error.status === 401 && error.config && !error.config.__isRetryRequest) {
        store.dispatch('LOGOUT')
      }
      throw error
    })
  }
)

export default client