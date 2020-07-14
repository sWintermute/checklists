<template lang="pug">
  v-app(id="inspire")
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
              text
              :to="menu.path"
            ) {{menu.title}}
        v-list-item
          v-list-item-content
            v-btn(text @click='LOGOUT') Выйти
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
        class="hidden-sm-and-down"
      )
        v-btn(
          text
          v-for="(menu, i) in menus"
          :key="i"
          :to="menu.path"
        ) {{ menu.title }}
        v-btn(
          text
          @click="LOGOUT"
        ) Выйти
    v-main
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
        title: 'Ответы',
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
        title: 'Карта (BETA)',
        path: '/map'
      }
    ]
  }),
  computed: {
    ...mapState(['loading']),
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn'
    })
  },
  methods: {
    ...mapActions({
      LOGOUT: 'user/LOGOUT'
    })
  }
}
</script>
