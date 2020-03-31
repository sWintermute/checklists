<template lang="pug">
    v-app(id="inspire")
        div
            v-navigation-drawer(
              app
              v-model="drawer"
              v-if="isLoggedIn"
              disable-resize-watcher
            )
              v-list
                v-list-item(
                  v-for="(menu, i) in menus"
                  :key="i"
                )
                  v-list-item-content
                    v-btn(
                      v-if="menu.title === 'Выйти'"
                      @click="logoutSubmit"
                      text
                      :to="menu.path"
                    ) {{menu.title}}
                    v-btn(
                      v-else
                      text
                      :to="menu.path"
                    ) {{menu.title}}
            v-app-bar(
              app
            )
                v-app-bar-nav-icon(
                  v-if="isLoggedIn"
                  @click="drawer = !drawer"
                  class="hidden-md-and-up"
                )
                v-spacer(
                  class="hidden-md-and-up"
                  v-if="isLoggedIn"
                )
                v-img(
                  src="/static/blue-tick2.png"
                  max-width="22px"
                  max-height="22px"
                )
                router-link(
                  to="/"
                  tag="a"
                  style="text-decoration: none;"
                )
                    v-toolbar-title(
                      class="mx-2 headline primary--text"
                    ) Checklists
                v-spacer(
                  class="hidden-sm-and-down"
                )
                v-toolbar-items(
                  v-if="isLoggedIn"
                )
                    v-btn(
                      text
                      class="hidden-sm-and-down"
                      v-for="(menu, i) in menus"
                      :key="i"
                      :to="menu.path"
                      @click="menu.method && logoutSubmit"
                    ) {{ menu.title }}
        v-content
            router-view
            loading(
              :active.sync="loading"
              :can-cancel="true"
              is-full-page
            )
</template>

<script>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

import { mapGetters, mapActions, mapState } from 'vuex'
import types from '@/store/types'

export default {
  dependencies : '$repositories',
  name: 'App',
  components: {
    Loading
  },
  data: () => ({
    onCancel: false,
    drawer: false,
    clipped: false,
    menus: [
      {
        title: 'Чеклисты',
        path: '/',
        icon: '',
        method: false
      },
      {
        title: 'Ответы',
        path: '/responses',
        method: false
      },
      {
        title: 'Отчеты',
        path: '/reports',
        method: false
      },
      {
        title: 'Профиль',
        path: '/profile',
        method: false
      },
      {
        title: 'Карта (BETA)',
        path: '/map',
        method: false
      },
      {
        title: 'Выйти',
        path: '/logout',
        method: true
      }
    ]
  }),
  computed: {
    ...mapState(['auth_token', 'loading']),
    ...mapGetters(['isLoggedIn'])
  },
  methods: {
    ...mapActions([types.LOGOUT]),
    logoutSubmit () {
      this.LOGOUT({ vm: this })
    }
  }
}
</script>
