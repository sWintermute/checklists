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
            v-snackbar(
                v-model="error.data.snackbar"
                bottom
                color="error"
                multi-line
                :timeout="6000"
                vertical
            )
                    | {{ error.data.detail }}
                    v-btn(
                        dark
                        text
                        @click="error.data.snackbar = false"
                    )
                        | Close
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex"
import types from "@/store/types"


export default {
    name: 'App',
    data: () => ({
        drawer: false,
        clipped: false,
        menus: [
            {
                title: 'Чеклисты',
                path: '/',
                icon: ""
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
            },
        ]
    }),
    computed: {
        ...mapState(["auth_token"]),
        ...mapGetters(["isLoggedIn", "error"])
    },
    methods: {
        ...mapActions([types.LOGOUT])
    },
};
</script>
