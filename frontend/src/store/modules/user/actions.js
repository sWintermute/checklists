import router from '@/router'
import ApiService from "@/services/api.js";
import tokenService from "@/services/tokenService.js";
import types from "@/store/types/user.js"

export default {
    async [types.PROFILE]({ commit }){
        return new Promise((resolve, reject) => {
            commit('SET_LOADING_STATUS', true);
            ApiService.setHeader();
            return ApiService.get("api/v1/me",)
                .then(({ data }) => {
                    commit('SET_LOADING_STATUS', false);
                    commit('SET_USER', data);
                    resolve(data)
                }).catch(error => {
                    commit(types.SET_ERROR, error.response);
                    console.log(error.response);
                    reject(error);
                })
        })
    },
    [types.LOGIN]({ commit }, user){
        return new Promise((resolve, reject) => {
            ApiService.post("auth/token/login", user)
                .then((response) => {
                    tokenService.saveToken(response.data.auth_token)
                    ApiService.setHeader();
                    commit('SET_AUTH_SUCCESS', response.data.user);
                    router.push("/profile");
                    resolve(response);
                })
                .catch((error) => {
                    commit(types.SET_ERROR, error.response);
                    console.log(error.response);
                    reject(error)
                })
        })
    },
    [types.LOGOUT]({ commit }){
        return new Promise(() => {
            ApiService.post("auth/token/logout");
            ApiService.removeHeader();
            commit('SET_LOGOUT');
            router.push("/login");
        })
    }
}
