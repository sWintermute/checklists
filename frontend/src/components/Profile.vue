<template>
    <v-container
            class="fill-height"
            fluid>
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
                    <v-card-text>
                        <v-flex class="mb-4 d-flex" justify-center align-center>
                            <v-avatar color="primary" class="">
                                <v-icon x-large dark>mdi-account-circle</v-icon>
                            </v-avatar>
                        </v-flex>
                        <v-text-field
                                v-model="user.first_name"
                                label="Имя"
                                disabled
                        ></v-text-field>
                        <v-text-field
                                v-model="user.last_name"
                                label="Фамилия"
                                disabled
                        ></v-text-field>
                        <v-text-field
                                v-model="user.position"
                                label="Должность"
                                disabled
                        ></v-text-field>
                        <v-text-field
                                v-model="user.email"
                                label="Почта"
                                disabled
                        ></v-text-field>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'profile',
        data: () => ({
            loading: false
        }),
        created: function () {
            this.$store.dispatch('profile');
        },
        computed: {
            ...mapGetters(['user']),
        },
        methods: {}
    }
</script>