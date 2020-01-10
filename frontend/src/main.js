import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import VueLoading from 'vue-loading-template'
import vuetify from '@/plugins/vuetify'
import '@/plugins/axios'
import "@/plugins/vee-validate";

Vue.config.productionTip = false;

Vue.use(VueLoading);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
