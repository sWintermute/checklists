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
        methods: {
            openAvatarPicker () {
                this.showAvatarPicker = true
            },
            selectAvatar (avatar) {
                this.form.avatar = avatar
            }
        }
    }
</script>

<style lang="sass" scoped>
    .profile__block
        max-width: 360px
        min-width: 280px
        padding: 20px 10px
        background: white
        box-shadow: 1px 1px 4px -1px black
    .profile
        color: black
        .profile__image__container
            margin: 0 0 20px 0
            .profile__image
                display: flex
                flex-direction: column
                flex-wrap: nowrap
                justify-content: center
                align-items: center
        .profile__name__block
            display: flex
            flex-direction: row
            flex-wrap: wrap
            justify-content: center
            align-items: center
            margin: 0 0 20px 0
            .profile__name

            .first__name
                margin: 0 10px 0 0
            .last__name
        .profile__empposition
            text-align: center
            .empposition__text
                font-size: small
                color: gray
        .profile__email
            margin: 20px 0 0 0
            text-align: center
</style>