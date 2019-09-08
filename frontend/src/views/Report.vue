<template lang="pug">
    div
        | {{report}}
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "report",
        data() {
            return {
                answers: {
                },
            }
        },
        created: function () {
            this.$store.dispatch('report', this.$route.params.id);
        },
        computed: {
            ...mapState(["report"])
        },
        methods: {
            sendChecklist() {
                this.$store.dispatch('create_list', this.$route.params.id);
            },
        }
    }
</script>

<style lang="sass" scoped>
</style>