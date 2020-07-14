import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import VueLoading from 'vue-loading-template'
import vuetify from '@/plugins/vuetify'
import '@/plugins/axios'
import '@/plugins/vee-validate'

import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'

import DateFilter from '@/filters/dateFormat.filter.js'

import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// this part resolve an issue where the markers would not appear
delete Icon.Default.prototype._getIconUrl

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

Vue.config.productionTip = false

Vue.use(VueLoading)
Vue.use(VueToast, {
  position: 'top-right'
})

Vue.filter('date', DateFilter)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
