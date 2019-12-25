import router from '@/router'
import ApiService from "@/services/api.js";
import tokenService from "@/services/tokenService.js";
import types from "@/store/types"

export default {
    [types.PROFILE]({ commit }){
        return new Promise((resolve, reject) => {
            commit('SET_LOADING_STATUS', true);
            ApiService.setHeader();
            return ApiService.get("api/v1/me",)
                .then(({ data }) => {
                    commit('SET_LOADING_STATUS', false);
                    commit('SET_USER', data);
                    resolve(data)
                }).catch(error => {
                    commit("SET_ERROR", error.response);
                    console.log(error.response);
                    reject(error);
                })
        })
    },
    [types.LOGIN]({ commit }, user){
        return new Promise((resolve, reject) => {
            ApiService.post("auth/token/login", user)
                .then((response) => {
                    tokenService.saveToken(response.data["auth_token"]);
                    router.push({ name: 'profile' });
                    resolve(response);
                })
                .catch((error) => {
                    commit("SET_ERROR", error.response);
                    console.log(error.response);
                    reject(error);
                })
        })
    },
    [types.LOGOUT]({ commit }){
        ApiService.post("auth/token/logout");
        ApiService.removeHeader();
        tokenService.destroyToken();
        commit('SET_LOGOUT');
        router.push("/login");
    }
}
