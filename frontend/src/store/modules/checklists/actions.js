import router from "@/router";
import ApiService from "@/services/api.js";
import types from "@/store/types/checklists.js"

export default {
    [types.SEND_CHECKLIST]({ commit, state }, { fileList, userProfile, listId }){
        return new Promise((resolve, reject) => {
            commit('SET_LOADING_STATUS', true);
            state.list.id = parseInt(listId);
            state.list.created = new Date;
            state.list.updated = new Date;
            state.list.survey = parseInt(listId);
            state.list.user = userProfile.id;
            state.list.photo = fileList;
            state.list.answers = [];
            for (let [key, value] of Object.entries(state.answers)) {
                state.list.answers.push({question: key, body: value});
            }
            commit('SET_LOADING_STATUS', false);
            ApiService.setHeader();
            ApiService.post('/api/v1/response', state.list)
                .then(response => {
                    router.push('/');
                    resolve(response);
                }).catch(error => {
                    commit(types.SET_ERROR, error.response);
                    console.log(error.response);
                    reject(error);
                })
        })
    },
    [types.FETCH_CHECKLIST]({ commit }, list_id) {
        return new Promise((resolve, reject) => {
            commit('SET_LOADING_STATUS', true);
            ApiService.setHeader();
            ApiService.get('api/v1/lists', list_id)
                .then(response => {
                    commit('SET_LOADING_STATUS', false);
                    const list = response.data;
                    commit('SET_LIST', list);
                    resolve(response);
                }).catch(error => {
                    commit(types.SET_ERROR, error.response);
                    console.log(error.response);
                    reject(error);
                })
        })
    },
    [types.FETCH_CHECKLISTS]({ commit }) {
        return new Promise((resolve, reject) => {
            commit('SET_LOADING_STATUS', true);
            ApiService.setHeader();
            ApiService.get('api/v1/lists',)
                .then(response => {
                    commit('SET_LOADING_STATUS', false);
                    const lists = response.data;
                    commit('SET_LISTS', lists);
                    resolve(response);
                }).catch(error => {
                    commit(types.SET_ERROR, error.response);
                    console.log(error.response);
                    reject(error);
                })
        })
    }
}
