import ApiService from "@/services/api.js";
import types from "@/store/types/filledChecklists.js"

export default {
    [types.FETCH_FILLED_CHECKLIST]({ commit }) {
        return;
    },
    [types.FETCH_FILLED_CHECKLISTS]({ commit }) {
        return new Promise((resolve, reject) => {
            commit('SET_LOADING_STATUS', true);
            ApiService.setHeader();
            ApiService.get('api/v1/responses',)
                .then(response => {
                    const lists = response.data;
                    commit('SET_FILLED_LISTS', lists);
                    resolve(response)
                }).catch(error => {
                    commit(types.SET_ERROR, error.response);
                    console.log(error.response);
                    reject(error);
                })
        })
    },
    [types.CREATE_FILLED_CHECKLISTS]({ commit }) {
        return;
    },

}
