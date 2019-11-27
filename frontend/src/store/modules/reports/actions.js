import ApiService from "@/services/api.js";
import types from "@/store/types"

export default {
    [types.FETCH_REPORT]({ commit },  report_id) {
        return new Promise((resolve, reject) => {
            commit('SET_LOADING_STATUS', true);
            ApiService.get("api/v1/report", report_id)
                .then(response => {
                    commit('SET_LOADING_STATUS', false);
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
                    commit("SET_LOADING_STATUS", false);
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
                    router.push('/');
                    resolve(response);
                }).catch(error => {
                    commit(types.SET_ERROR, error.response);
                    console.log(error);
                    reject(error);
                })
        })
    },
}
