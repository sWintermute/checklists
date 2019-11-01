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
                .then(response => {
                    commit('SET_LOADING_STATUS', false);
                    const token = response.data.auth_token;
                    const user = response.data.user;
                    localStorage.setItem('token', token);
                    axios.defaults.headers.common['Authorization'] = token;
                    commit('SET_AUTH_SUCCESS', token, user);
                    console.log(user);
                    resolve(response)
                })
                .catch(err => {
                    commit('SET_AUTH_ERROR');
                    commit('SET_ERROR', err.response.data);
                    localStorage.removeItem('token');
                    reject(err)
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
