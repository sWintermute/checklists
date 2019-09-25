import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'
import Axios from 'axios'

import VueLoading from 'vue-loading-template'
import vuetify from './plugins/vuetify'
import "./plugins/vee-validate"

import 'material-design-icons-iconfont/dist/material-design-icons.css'
import './stylus/main.styl'

Vue.prototype.$http = Axios;
const token = localStorage.getItem('user-token');
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token;
}

Vue.config.productionTip = false;

Vue.use(VueLoading);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
