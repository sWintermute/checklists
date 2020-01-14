// axios.interceptors.response.use(
//     response => {
//         return response;
//     },
//     function(error) {
//         // Do something with response error
//         if (error.response.status === 401) {
//             console.log("unauthorized, logging out ...");
//             auth.logout();
//             router.replace("/auth/login");
//         }
//         return Promise.reject(error.response);
//     }
// );
import Vue from 'vue';
import store from '@/store';
import router from '@/router';
import types from "@/store/types";
import ApiService from "@/services/api";


ApiService.init();
