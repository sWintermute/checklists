import axios from "axios";
import router from '@/router'
import ApiService from "@/services/api.js";
import types from "@/store/types/user.js"

export default {
    [types.PROFILE]({commit}) {
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
    [types.LOGIN]({commit}, user){
        return new Promise((resolve, reject) => {
            commit('SET_LOADING_STATUS', true);
            commit('SET_AUTH_SUCCESS');
            ApiService.post("auth/token/login", user)
                .then(({data}) => {
                    commit('SET_LOADING_STATUS', false);
                    localStorage.setItem('token', data.auth_token);
                    commit('SET_AUTH_SUCCESS', data.auth_token, data.user);
                    resolve(data)
                    router.push("/profile");
                })
                .catch(error => {
                    commit('SET_AUTH_ERROR');
                    commit('SET_ERROR', error);
                    localStorage.removeItem('token');
                    reject(error)
                })
        })
    },
    [types.LOGOUT]({commit}){
        return new Promise(() => {
            ApiService.post("auth/token/logout");
            ApiService.removeHeader();
            commit('SET_LOGOUT');
            localStorage.removeItem('token');
            router.push("/login");
        })
    }
}
