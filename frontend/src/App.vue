<template>
    <div id="app">
        <v-app id="inspire">
            <span>
                <v-navigation-drawer app v-model="drawer">
                    <v-list>
                        <template v-for="(menu, i) in menus">
                            <v-list-item :key="i">
                                <v-list-item-content>
                                    <v-btn text :to="menu.path">{{menu.title}}</v-btn>
                                </v-list-item-content>
                            </v-list-item>
                            <v-divider :key="`divider-${i}`"></v-divider>
                        </template>
                    </v-list>
                </v-navigation-drawer>
                <v-app-bar app>
                    <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = !drawer"></v-app-bar-nav-icon>
                    <v-spacer class="hidden-md-and-up"></v-spacer>
                    <v-img src="/static/blue-tick2.png" max-width="22px" max-height="22px"></v-img>
                    <v-toolbar-title class="mx-2 headline primary--text">Checklists</v-toolbar-title>
                    <v-spacer class="hidden-sm-and-down"></v-spacer>
                    <v-toolbar-items>
                        <template v-for="(menu, i) in menus">
                            <v-btn text class="hidden-sm-and-down" :to="menu.path">
                                    {{menu.title}}
                             </v-btn>
                        </template>
                        <v-btn color="primary white--text" class="hidden-sm-and-down">Sign Up</v-btn>
                    </v-toolbar-items>
                </v-app-bar>
            </span>
            <v-content fluid>
                <router-view />
            </v-content>
        </v-app>
    </div>
</template>

<script>
    export default {
        name: 'App',
        data: () => ({
            drawer: false,
            clipped: false,
            menus: [
                {
                    title: 'Чек-листы',
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
        })
    };
</script>
