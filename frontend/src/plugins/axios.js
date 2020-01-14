import Vue from 'vue';
import store from '@/store';
import router from '@/router';
import types from "@/store/types";
import ApiService from "@/services/api";


ApiService.init();

Vue.axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  if (error.response.status === 401) {
    router.replace("/login");
  }
  return Promise.reject(error);
});
