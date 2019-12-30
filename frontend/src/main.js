import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store.js'
import VueLoading from 'vue-loading-template'
import vuetify from './plugins/vuetify'
import "@/plugins/vee-validate";
import ApiService from "@/services/api";

Vue.config.productionTip = false;

ApiService.init();

console.log(process.env);

Vue.use(VueLoading);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
