<template lang="pug">
    v-container(
        class="fill-height"
        fluid
    )
        v-row(
            align="center"
            justify="center"
        )
            v-col(
                cols="12"
                sm="8"
                md="4"
            )
                v-card(class="elevation-2 rounded-card" tile)
                    v-card-text
                        v-flex(class="mb-4 d-flex" justify-center align-center)
                            v-avatar(color="primary")
                                v-icon(x-large dark) mdi-account-circle
                        v-text-field(
                            v-model="user.first_name"
                            label="Имя"
                            disabled
                        )
                        v-text-field(
                            v-model="user.last_name"
                            label="Фамилия"
                            disabled
                        )
                        v-text-field(
                            v-model="user.position"
                            label="Должность"
                            disabled
                        )
                        v-text-field(
                            v-model="user.email"
                            label="Почта"
                            disabled
                        )
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'profile',
        data: () => ({}),
        created: function () {
            this.profile()
        },
        computed: {
            ...mapGetters(['user']),
        },
        methods: {
            ...mapActions(["profile"]),
        }
    }
</script>
