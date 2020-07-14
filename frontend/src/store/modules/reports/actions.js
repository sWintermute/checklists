import ApiService from '@/services/api.js'

export default {
  async FETCH_REPORT ({ commit }, reportId) {
    try {
      ApiService.setHeader()
      const data = await ApiService.get('api/v1/report', reportId)
      commit('SET_REPORT', data)
    } catch (error) {
      console.log(error)
    }
  },
  async FETCH_REPORTS ({ commit }) {
    try {
      ApiService.setHeader()
      const data = await ApiService.get('api/v1/reports')
      commit('SET_REPORTS', data)
    } catch (error) {
      console.log(error)
    }
  },
  async CREATE_REPORT ({ commit, dispatch }, report) {
    try {
      ApiService.setHeader()
      await ApiService.post('api/v1/reports', report)
      dispatch('FETCH_REPORTS')
    } catch (error) {
      console.log(error)
    }
  },
  async REMOVE_REPORT ({ dispatch }, reportId) {
    try {
      ApiService.setHeader()
      await ApiService.delete('api/v1/reports', reportId)
      await dispatch('FETCH_REPORTS')
    } catch (error) {
      console.log(error)
    }
  }
}
