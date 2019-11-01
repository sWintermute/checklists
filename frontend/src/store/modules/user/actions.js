import axios from 'axios';
import ApiService from "@/services/api.js";

export default {
    profile({commit}) {
        return new Promise((resolve, reject) => {
            commit('SET_LOADING_STATUS', true);
            ApiService.setHeader();
            ApiService.get("api/v1/me",)
                .then(({data}) => {
                    commit('SET_LOADING_STATUS', false);
                    commit('SET_USER', data);
                    resolve(data)
                }).catch(error => {
                    console.log(error);
                    reject(error)
                })
        })
    },
    login({commit}, user){
        return new Promise((resolve, reject) => {
            commit('SET_LOADING_STATUS', true);
            commit('SET_AUTH_REQUEST');
            axios({url: '/auth/token/login', data: user, method: 'POST' })
                .then(({data}) => {
                    commit('SET_LOADING_STATUS', false);
                    localStorage.setItem('token', data.auth_token);
                    commit('SET_AUTH_SUCCESS', data.auth_token, data.user);
                    resolve(data)
                })
                .catch(error => {
                    commit('SET_AUTH_ERROR');
                    commit('SET_ERROR', error);
                    localStorage.removeItem('token');
                    reject(error)
                })
        })
    },
    logout({commit}){
        return new Promise((resolve, reject) => {
            commit('SET_LOGOUT');
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            resolve()
        })
    }
}
