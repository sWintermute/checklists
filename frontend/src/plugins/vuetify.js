import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import zhHans from 'vuetify/es5/locale/ru'

Vue.use(Vuetify)

const options = {
  icons: {
    iconfont: 'mdiSvg'
  },
  lang: {
    locales: { zhHans },
    current: 'zhHans'
  }
}

export default new Vuetify(options)