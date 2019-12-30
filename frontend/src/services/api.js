import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import TokenService from './tokenService';
import BASE_URL from './config'

const ApiService = {
    init() {
        Vue.use(VueAxios, axios);
        Vue.axios.defaults.baseURL = BASE_URL;
    },
    setHeader(token) {
        if (token) {}
        Vue.axios.defaults.headers.common["Authorization"] = token ? `Token ${token}`: `Token ${TokenService.getToken()}`;
    },
    removeHeader() {
        Vue.axios.defaults.headers.common["Authorization"] = null;
    },
    get(resource, id="") {
        return Vue.axios.get(`${resource}/${id}`);
    },
    post(resource, params) {
        return Vue.axios.post(`${resource}/`, params);
    },
    delete(resource, id="") {
        return Vue.axios.delete(`${resource}/${id}`);
    },
    bar(resource, options) {
        return Vue.axios.post(`${resource}/`, options);
    },
};

export default ApiService;
