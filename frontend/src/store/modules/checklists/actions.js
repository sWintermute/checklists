import axios from 'axios';
import router from "@/router";
import ApiService from "@/services/api.js";
import types from "@/store/types/checklists.js"

export default {
    create_list({commit, state}, {fileList, listId}){
        return new Promise((resolve, reject) => {
            commit('SET_LOADING_STATUS', true);
            state.list.id = parseInt(listId);
            state.list.created = new Date;
            state.list.updated = new Date;
            state.list.survey = parseInt(listId);
            state.list.user = state.user.id;
            state.list.photo = fileList;
            state.list.answers = [];
            for (let [key, value] of Object.entries(state.answers)) {
                state.list.answers.push({question: key, body: value});
            }
            commit('SET_LOADING_STATUS', false);
            axios({
                url: '/api/v1/response/',
                headers: {
                    Authorization: 'Token ' + state.token,
                },
                data: state.list,
                method: 'POST'
            }).then(response => {
                const list = response.data;
                localStorage.setItem('list', list);
                commit('SET_LIST', list);
                resolve(response);
                router.push('/')
            }).catch(error => {
                console.log(error);
                reject(error)
            })
        })
    },
    [types.FETCH_CHECKLIST]({commit}, list_id) {
        return new Promise((resolve, reject) => {
            commit('SET_LOADING_STATUS', true);
            ApiService.setHeader();
            ApiService.get('api/v1/lists', list_id)
                .then(response => {
                    commit('SET_LOADING_STATUS', false);
                    const list = response.data[0];
                    commit('SET_LIST', list);
                    resolve(response)
                }).catch(error => {
                    console.log(error);
                    reject(error)
                })
        })
    },
    [types.FETCH_CHECKLISTS]({commit}) {
        return new Promise((resolve, reject) => {
            commit('SET_LOADING_STATUS', true);
            ApiService.setHeader();
            ApiService.get('api/v1/lists',)
                .then(response => {
                    commit('SET_LOADING_STATUS', false);
                    const lists = response.data;
                    commit('SET_LISTS', lists);
                    resolve(response)
                }).catch(error => {
                    console.log(error);
                    reject(error)
                })
        })
    }
}
