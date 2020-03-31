import client from '@/services/client/api'

let loadFunction = (config) => {
  console.log(test, test2)
  this.$store.commit('SET_LOADING_STATUS', true)
  return config
}

let finishFunction = response => {
  this.$store.commit('SET_LOADING_STATUS', false)
  return response
}

// let errorFunction = error => {
//   this.$store.commit('SET_LOADING_STATUS', false)
//   return Promise.reject(error)
// }

client.interceptors.request.use(loadFunction)
// client.interceptors.response.use(finishFunction, errorFunction)

client.interceptors.response.use(
  finishFunction, 
  error => {
    return new Promise(function (resolve, reject) {
      this.$store.commit('SET_LOADING_STATUS', false)
      if (error.status === 401 && error.config && !error.config.__isRetryRequest) {
        this.$store.dispatch('LOGOUT')
      }
      throw error
    })
  }
)

export default client