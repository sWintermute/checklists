import ApiService from "@/services/api.js";
import types from "@/store/types"
import router from '@/router'

export default {
  [types.FETCH_REPORT] ({ commit }, reportId) {
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
  [types.FETCH_REPORTS] ({ commit }) {
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
    [types.CREATE_REPORT]({ commit, dispatch }, report) {
        return new Promise((resolve, reject) => {
            ApiService.setHeader();
            commit('SET_LOADING_STATUS', true);
            ApiService.post("api/v1/reports", report)
                .then(response => {
                    commit('SET_LOADING_STATUS', false);
                    dispatch(types.FETCH_REPORTS)
                    resolve(response);
                }).catch(error => {
                    console.log(error);
                    reject(error);
                })
        })
    },
    async [types.REMOVE_REPORT]({ commit, dispatch }, reportId) {
        ApiService.setHeader();
        try {
            await ApiService.delete("api/v1/reports", reportId),
            await dispatch(types.FETCH_REPORTS)
        } catch {}
    }
}
