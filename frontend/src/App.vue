<template lang="pug">
    v-app(id="inspire")
        div
            v-navigation-drawer(app v-model="drawer" v-if="isLoggedIn")
                v-list
                    template(v-for="(menu, i) in menus")
                        v-list-item(:key="i")
                            v-list-item-content
                                v-btn(v-if="menu.title === 'Выйти'" @click='LOGOUT' text :to="menu.path") {{menu.title}}
                                v-btn(v-else text :to="menu.path") {{menu.title}}
            v-app-bar(app)
                v-app-bar-nav-icon(class="hidden-md-and-up" @click="drawer = !drawer" v-if="isLoggedIn")
                v-spacer(class="hidden-md-and-up" v-if="isLoggedIn")
                v-img(src="/static/blue-tick2.png" max-width="22px" max-height="22px")
                router-link(to="/" tag="a" style="text-decoration: none;")
                    v-toolbar-title(class="mx-2 headline primary--text") Checklists
                v-spacer(class="hidden-sm-and-down")
                v-toolbar-items
                    v-btn(v-if="isLoggedIn" text class="hidden-sm-and-down" to="/") Чеклисты
                    v-btn(v-if="isLoggedIn" text class="hidden-sm-and-down" to="/responses") Ответы на чеклисты
                    v-btn(v-if="isLoggedIn" text class="hidden-sm-and-down" to="/reports") Отчеты
                    v-btn(v-if="isLoggedIn" text class="hidden-sm-and-down" to="/profile") Профиль
                    v-btn(v-if="isLoggedIn" text class="hidden-sm-and-down" @click="LOGOUT") Выйти
        v-content(fluid)
            router-view
            loading(
                :active.sync="loading"
                :can-cancel="true"
                is-full-page
            )
</template>

<script>

// Import component
import Loading from 'vue-loading-overlay'
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css'

import { mapGetters, mapActions, mapState } from 'vuex'
import types from '@/store/types'

export default {
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
        icon: ''
      },
      {
        title: 'Ответы на чеклисты',
        path: '/responses'
      },
      {
        title: 'Отчеты',
        path: '/reports'
      },
      {
        title: 'Профиль',
        path: '/profile'
      },
      {
        title: 'Выйти',
        path: '/logout'
      }
    ]
  }),
  computed: {
    ...mapState(['auth_token', 'loading']),
    ...mapGetters(['isLoggedIn', 'error'])
  },
  methods: {
    ...mapActions([types.LOGOUT])
  }
}
</script>
