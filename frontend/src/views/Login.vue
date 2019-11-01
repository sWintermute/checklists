<template>
    <v-container
            class="fill-height"
            fluid
    >
        <v-row
                align="center"
                justify="center"
        >
            <v-col
                    cols="12"
                    sm="8"
                    md="4"
            >
                <v-card class="elevation-2 rounded-card" tile>
                    <v-toolbar
                            color="primary"
                            dark
                            flat
                    >
                        <v-toolbar-title class="">Введите свои данные</v-toolbar-title>
                        <div class="flex-grow-1"></div>
                    </v-toolbar>
                    <v-card-text class="px-6 pt-6 pb-0">
                        <ValidationObserver v-slot="{ passes }">
                            <form @keyup.enter="login">
                                <ValidationProvider name="email" rules="required|email" v-slot="{ errors }">
                                    <v-text-field
                                            :error-messages="errors"
                                            v-model="email"
                                            label="Почта"
                                            prepend-icon="mdi-account-circle"
                                    ></v-text-field>
                                </ValidationProvider>
                                <ValidationProvider name="password" rules="required|min:8" v-slot="{ errors }">
                                    <v-text-field
                                            :error-messages="errors"
                                            v-model="password"
                                            id="password"
                                            label="Пароль"
                                            name="password"
                                            prepend-icon="mdi-lock"
                                            type="password"
                                    ></v-text-field>
                                </ValidationProvider>
                            </form>
                            <div v-if="errors" class="subtitle1 text-center red--text">
                                <p v-for="(errorMessage, i) in errors" :key="i">{{ errorMessage[0] }}</p>
                            </div>
                        </ValidationObserver>
                    </v-card-text>
                    <v-card-actions class="justify-end px-6">
                        <v-btn class="ma-2" tile outlined color="primary" @click="clear">Очистить</v-btn>
                        <v-btn tile color="primary" @click="login">Войти</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { ValidationObserver, ValidationProvider } from "vee-validate";
    import { mapGetters } from 'vuex'

    export default {
        name: "Login",
        components: {
            ValidationObserver,
            ValidationProvider
        },
        props: {
            source: String,
        },
        data: () => ({
            email: "",
            password: ""
        }),
        methods: {
            login() {
                let email = this.email;
                let password = this.password;
                this.$store.dispatch('login', { email, password })
                    .then(() => this.$router.push('/profile'))
                    .catch(err => console.log(err))
            },
            clear() {
                this.email = '';
                this.password = '';
            }
        },
        computed: {
            ...mapGetters(['errors'])
        },
    };
</script>