import Vue from 'vue';
import router from '@/router';
import ApiService from "@/services/api.js";
import tokenService from "@/services/tokenService.js";
import types from "@/store/types";

export default {
    [types.PROFILE]({ commit }){
        return new Promise((resolve, reject) => {
            commit('SET_LOADING_STATUS', true);
            ApiService.setHeader();
            return ApiService.get("api/users/me")
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
            ApiService.removeHeader();
            ApiService.post("api/auth/token/login", user)
                .then((response) => {
                    tokenService.saveToken(response["data"]["auth_token"]);
                    commit("SET_AUTH_TOKEN", response["data"]["auth_token"]);
                    commit("SET_AUTH_SUCCESS");
                    router.push("/profile");
                    resolve();
                })
                .catch((error) => {
                    Vue.$toast.open({
                        message: [
                            "Невозможно войти с предоставленными учетными данными.",
                            "Статус: " + error.response.status].join(" "),
                        type: 'error',
                    });
                    console.log({error});
                    reject(error);
                })
        })
    },
    [types.LOGOUT]({ commit }){
        return new Promise((resolve, reject) => {
            ApiService.setHeader();
            ApiService.post("api/auth/token/logout")
            .then((response) => {
                ApiService.removeHeader();
                commit("SET_LOGOUT");
                resolve();
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            })
            .finally(() => {
                tokenService.destroyToken();
                router.push("/login");
            })
        });
    }
}
