import Vue from 'vue'
// import store from '@/store'
// import router from '@/router'
// import types from '@/store/types'
import ApiService from '@/services/api'

ApiService.init()

Vue.axios.interceptors.response.use(undefined, function (err) {
  return new Promise(function (resolve, reject) {
    if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
    // if you ever get an unauthorized, logout the user
      this.$store.dispatch(AUTH_LOGOUT)
    // you can also redirect to /login if needed !
    }
    throw err;
  });
});
