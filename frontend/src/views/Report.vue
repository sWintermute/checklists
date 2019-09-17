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
    @import url(https://fonts.googleapis.com/css?family=Oxygen);
    $true-white: #fff;
    $white: #F5F5F5;
    $spacer: 1.5rem;
    $material-shadow: 0 2px 3px rgba(0,0,0,.05), 0 1px 2px rgba(0,0,0,.12);
    $header: #616161;
    $sub-header: #757575;
    $grey-text: #9E9E9E;
    $grey: #BDBDBD;
    $main-color: #006d8e;
    *,
    *:after,
    *:before {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    body{
        font-family: 'Oxygen', sans-serif;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background: $white;
        margin: 0;
        padding: 0;
    }

    h1{
        margin:0;
        color: $header;
        font-size: 3rem;
    }

    .card__header{
        text-align: center;
    }
    .card__header h2{
        font-weight: 300;
        font-size: 1.5em;
    }

    .container-wide{
        max-width: 100%;
    }

    .banner{
        background: $main-color;
        padding: 5rem $spacer 3rem;
        margin-bottom: $spacer;
        h1{
            color: $white;
        }
    }

    .container{
        max-width: 960px;
        margin: 0 auto;
    }

    .card{
        background: $true-white;
        padding: 10px 20px;
        margin: 10px 0;
        width: 100%;
        border-radius: .25rem;
        box-shadow: $material-shadow;
    }

    .table{
        width: 100%;
        border-collapse: collapse;
        margin-bottom: $spacer;
        .row-header{
            color: $grey-text;
        }

        tr{
            border-bottom: 1px solid $grey;
            &:last-child{
                border: 0;
            }
        }

        td{
            text-align: right;
            padding: 1.4rem 0;
        }

        td ul {
            padding: 0;
            min-width: 360px;
        }
        td ul li span {
            display: block;
            margin: 0 0 10px 0;
        }

        .left{
            text-align: left;
        }
    }

    .table-hover {
        > tbody > tr:hover {
            > td,
            > th {
                background-color: rgba($main-color, 0.125);
            }
        }
    }

    .table-hover {
        > tbody > tr:hover {
            box-shadow: $material-shadow;
        }
    }
</style>