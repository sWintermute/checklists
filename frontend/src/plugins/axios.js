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
import types from "@/store/types";
import ApiService from "@/services/api";


ApiService.init();

Vue.axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return new Promise((resolve, reject) => {
      if (error.response.status === 401 && error.config && !error.config.__isRetryRequest) {
        store.dispatch(types.LOGOUT);
        console.log({error});
      }
      reject(error);
    })
})
