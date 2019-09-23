<template>
    <v-container fluid>
        <v-layout column>
            <v-card>
                <v-card-text>
                    <v-flex class="mb-4">
                        <v-avatar size="96" class="mr-4">account_circle
                        </v-avatar>
                        <v-btn @click="openAvatarPicker">Change Avatar</v-btn>
                    </v-flex>
                    <v-text-field
                            v-model="form.firstName"
                            label="FirstName"></v-text-field>
                    <v-text-field
                            v-model="form.lastName"
                            label="Last Name"></v-text-field>
                    <v-text-field
                            v-model="form.contactEmail"
                            label="Email Address"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" :loading="loading" @click.native="update">
                        <v-icon left dark>check</v-icon>
                        Save Changes
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-layout>
    </v-container>
</template>

<script>
    import { mapState } from 'vuex';

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
            ...mapState(["user"])
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