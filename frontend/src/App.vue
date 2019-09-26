<template>
    <v-app id="inspire">
        <span>
            <v-navigation-drawer app v-model="drawer" v-if="isLoggedIn">
                <v-list>
                    <template v-for="(menu, i) in menus">
                        <v-list-item :key="i">
                            <v-list-item-content>
                                <v-btn v-if="menu.title === 'Выйти'" @click='logout' text :to="menu.path">{{menu.title}}</v-btn>
                                <v-btn v-else-if="menu.title === 'Войти'" text class="hidden-sm-and-down" to="/login">Войти</v-btn>
                                <v-btn v-else text :to="menu.path">{{menu.title}}</v-btn>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                </v-list>
            </v-navigation-drawer>
            <v-app-bar app>
                <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = !drawer"></v-app-bar-nav-icon>
                <v-spacer class="hidden-md-and-up"></v-spacer>
                <v-img src="/static/blue-tick2.png" max-width="22px" max-height="22px"></v-img>
                <router-link to="/" tag="div">
                    <v-toolbar-title class="mx-2 headline primary--text">Checklists</v-toolbar-title>
                </router-link>
                <v-spacer class="hidden-sm-and-down"></v-spacer>
                <v-toolbar-items>
                    <v-btn v-if="isLoggedIn" text class="hidden-sm-and-down" to="/">Чеклисты</v-btn>
                    <v-btn v-if="isLoggedIn" text class="hidden-sm-and-down" to="/reports">Отчеты</v-btn>
                    <v-btn v-if="isLoggedIn" text class="hidden-sm-and-down" to="/profile">Профиль</v-btn>
                    <v-btn v-if="isLoggedIn" text class="hidden-sm-and-down" @click='logout'>Выйти</v-btn>
                    <v-btn v-else text class="hidden-sm-and-down" to="/login">Войти</v-btn>
                    <!--<v-btn color="primary white&#45;&#45;text" class="hidden-sm-and-down">Sign Up</v-btn>-->
                </v-toolbar-items>
            </v-app-bar>
        </span>
        <v-content fluid>
            <router-view />
        </v-content>
    </v-app>
</template>

<script>
    import { mapGetters } from 'vuex'


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
                {
                    title: 'Войти',
                    path: '/login'
                },
            ]
        }),
        computed : {
            ...mapGetters(['isLoggedIn'])
        },
        methods: {
            logout() {
                this.$store.dispatch('logout')
                    .then(() => {
                        this.$router.push('/login')
                    })
            }
        },
    };
</script>
