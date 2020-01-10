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
                    v-card-text(v-if="userProfile")
                        v-flex(class="mb-4 d-flex" justify-center align-center)
                            v-avatar(color="primary")
                                v-icon(x-large dark) {{ mdiAccountCircle }}
                        v-text-field(
                            :value="userProfile.first_name"
                            label="Имя"
                            disabled
                        )
                        v-text-field(
                            :value="userProfile.last_name"
                            label="Фамилия"
                            disabled
                        )
                        v-text-field(
                            :value="userProfile.position"
                            label="Должность"
                            disabled
                        )
                        v-text-field(
                            :value="userProfile.email"
                            label="Почта"
                            disabled
                        )
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import types from "@/store/types"
    import { mdiAccountCircle } from '@mdi/js'

    export default {
        name: 'Profile',
        data: () => ({
            mdiAccountCircle
        }),
        created() {
            this.PROFILE();
        },
        computed: {
            ...mapGetters(["userProfile"]),
        },
        methods: {
            ...mapActions([types.PROFILE]),
        }
    }
</script>
