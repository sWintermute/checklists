<template>
    <v-container fluid>
        <v-layout column>
            <v-card>
                <v-card-text>
                    <v-flex class="mb-4 d-flex" justify-center align-center>
                        <v-avatar color="primary" class="">
                            <v-icon x-large dark>mdi-account-circle</v-icon>
                        </v-avatar>
                    </v-flex>
                    <v-text-field
                            v-model="user.first_name"
                            label="Имя"></v-text-field>
                    <v-text-field
                            v-model="user.last_name"
                            label="Фамилия"></v-text-field>
                    <v-text-field
                            v-model="user.position"
                            label="Должность"></v-text-field>
                    <v-text-field
                            v-model="user.email"
                            label="Почта"></v-text-field>
                </v-card-text>
            </v-card>
        </v-layout>
    </v-container>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'profile',
        data: () => ({
            loading: false,
            form: {
                firstName: 'John',
                lastName: 'Doe',
                contactEmail: 'john@doe.com',
                avatar: 'MALE_CAUCASIAN_BLOND_BEARD'
            },
            showAvatarPicker: false
        }),
        created: function () {
            this.$store.dispatch('profile');
        },
        computed: {
            ...mapGetters(["user"])
        },
        methods: {}
    }
</script>