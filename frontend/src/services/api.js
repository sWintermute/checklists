import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import TokenService from './tokenService';

const ApiService = {
    init() {
        Vue.use(VueAxios, axios);
    },
    setHeader() {
        Vue.axios.defaults.headers.common.Authorization = `Token ${TokenService.getToken()}`;
    },
    removeHeader() {
        Vue.axios.defaults.headers.common.Authorization = null;
    },
    get(resource, id="") {
        return Vue.axios.get(`${resource}/${id}`);
    },
    post(resource, params) {
        return Vue.axios.post(`${resource}/`, params);
    },
};

export default ApiService;
