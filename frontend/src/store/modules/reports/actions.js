import ApiService from "@/services/api.js";
import types from "@/store/types"
import router from '@/router'

export default {
    [types.FETCH_REPORT]({ commit },  reportId) {
        return new Promise((resolve, reject) => {
            commit('SET_LOADING_STATUS', true);
            ApiService.get("api/v1/report", reportId)
                .then(response => {
                    const report = response.data;
                    commit('SET_REPORT', report);
                    resolve(response)
                }).catch(error => {
                    commit(types.SET_ERROR, error.response);
                    console.log(error.response);
                    reject(error);
                })
        })
    },
    [types.FETCH_REPORTS]({ commit }) {
        return new Promise((resolve, reject) => {
            commit("SET_LOADING_STATUS", true);
            ApiService.setHeader();
            ApiService.get("api/v1/reports")
                .then(response => {
                    const reports = response.data;
                    commit("SET_REPORTS", reports);
                    resolve(response)
                }).catch(error => {
                    commit(types.SET_ERROR, error.response);
                    console.log(error.response);
                    reject(error);
                })
        })
    },
    [types.CREATE_REPORT]({ commit }, report) {
        return new Promise((resolve, reject) => {
            ApiService.setHeader();
            ApiService.post("api/v1/reports", report)
                .then(response => {
                    resolve(response);
                }).catch(error => {
                    console.log(error);
                    reject(error);
                })
        })
    },
    [types.REMOVE_REPORT]({ commit }, reportId) {
        return new Promise((resolve, reject) => {
            ApiService.setHeader();
            ApiService.delete("api/v1/reports", reportId);
        })
    }
}
