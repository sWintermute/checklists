<template lang="pug">
    .container
        vue-loading(v-if="isLoading" type="spin" color="#28d" :size="{ width: '50px', height: '50px' }")
        .card(v-for='checklist in report.checklists')
            .card__header
                h2 {{checklist.name}}
            table.table.table-hover
                thead
                    tr
                        td.left.row-header № п/п
                        td(colspan=3).row-header Параметры
                        td.row-header Примечание
                tbody
                    tr(v-for='(question, i) in checklist.questions')
                        td.left {{i}}
                        td {{question.text}}
                        td(v-for="choice in question.choices.split(';')" v-if="question.choices")
                            template(v-if="!(choice === question.key_choices)")
                                span(style="color: green")
                                    | {{choice}}
                            template(v-else)
                                span(style="color: red")
                                    | {{choice}}
                        td(v-for="choice in question.choices.split(';')" v-else)
                            template(v-if="!(choice === question.key_choices)")
                                span
                                    | {{choice}}
                            template(v-else)
                                span(style="color: green")
                                    | {{choice}}
                        template(v-else)
                            td
                            td
                        td()
                            ul(v-if="question.notes")
                                li(v-for='(note, i) in question.notes')
                                    span(v-for="key in note.keys") {{note.created | date}}
                                        br
                                        | {{key.name}}
                                        br
                                        | {{key.answer}}
                                        br
</template>

<script>
    import { mapState, mapMutations } from 'vuex';
    import moment from 'moment';

    export default {
        name: "report",
        data() {
            return {
                answers: {},
            }
        },
        created: function () {
            this.$store.dispatch('report', this.$route.params.id);
        },
        computed: {
            ...mapState(["report"]),
            isLoading : function(){ return this.$store.getters.isLoading},
        },
        filters: {
            date: function(str) {
                if (!str) { return '(n/a)'; }
                str = new Date(str);
                // return this.$moment().format('DD.MM.YYYY');
                return str.getFullYear() + '-' + ((str.getMonth() < 9) ? '0' : '') + (str.getMonth() + 1) + '-' +
                    ((str.getDate() < 10) ? '0' : '') + str.getDate();
            }
        },
        methods: {
            ...mapMutations(["SET_LOADING_STATUS"]),
            sendChecklist() {
                this.$store.dispatch('create_list', this.$route.params.id);
            },
        }
    }
</script>

<style lang="scss" scoped>
</style>