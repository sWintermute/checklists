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
                        <v-form>
                            <v-text-field
                                label="Почта"
                                name="login"
                                prepend-icon="person"
                                type="text"
                            ></v-text-field>

                            <v-text-field
                                id="password"
                                label="Пароль"
                                name="password"
                                prepend-icon="lock"
                                type="password"
                            ></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions class="justify-end px-6">
                        <v-btn class="ma-2" tile outlined color="primary">Очистить</v-btn>
                        <v-btn tile color="primary" >Войти</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        props: {
            source: String,
        },
        data: () => ({
            drawer: null,
            email: '',
            password: '',
            serverError: '',
            successMessage: this.dataSuccessMessage,
            loading: false,
        }),
        methods: {
            login: function () {
                let email = this.email;
                let password = this.password;
                this.$store.dispatch('login', { email, password })
                    .then(() => this.$router.push('/profile'))
                    .catch(err => console.log(err))
            }
        }
    };
</script>

<style>
</style>