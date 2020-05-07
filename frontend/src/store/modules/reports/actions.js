import ApiService from '@/services/api.js'

export default {
  FETCH_REPORT ({ commit }, reportId) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING_STATUS', true)
      ApiService.get('api/v1/report', reportId)
        .then(response => {
          const report = response.data
          commit('SET_REPORT', report)
          commit('SET_LOADING_STATUS', false)
          resolve(response)
        }).catch(error => {
          console.log(error.response)
          reject(error)
        })
    })
  },
  FETCH_REPORTS ({ commit }) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING_STATUS', true)
      ApiService.setHeader()
      ApiService.get('api/v1/reports')
        .then(response => {
          const reports = response.data
          commit('SET_REPORTS', reports)
          commit('SET_LOADING_STATUS', false)
          resolve(response)
        }).catch(error => {
          console.log(error.response)
          reject(error)
        })
      })
  },
  CREATE_REPORT ({ commit, dispatch }, report) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      commit('SET_LOADING_STATUS', true);
      ApiService.post("api/v1/reports", report)
        .then(response => {
          commit('SET_LOADING_STATUS', false);
          dispatch('FETCH_REPORTS')
          resolve(response);
        }).catch(error => {
          console.log(error);
          reject(error);
        })
    })
  },
  async REMOVE_REPORT ({ dispatch }, reportId) {
    ApiService.setHeader()
    try {
      await ApiService.delete('api/v1/reports', reportId)
      await dispatch('FETCH_REPORTS')
    } catch {}
  }
}
