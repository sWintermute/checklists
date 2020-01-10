import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import VueLoading from 'vue-loading-template'
import vuetify from '@/plugins/vuetify'
import '@/plugins/axios'
import "@/plugins/vee-validate";

import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/index.css';

Vue.config.productionTip = false;

Vue.use(VueLoading);
Vue.use(VueToast);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
