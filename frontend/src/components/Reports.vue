<template lang="pug">
    .quiz-window
        .quiz-window-header
            .quiz-window-title Отчеты
        .quiz-window-body
            .gui-window-awards
                ul.guiz-awards-row.guiz-awards-header
                    li.guiz-awards-header-title № п/п
                    li.guiz-awards-header-track Название
                    li.guiz-awards-header-time Дата
                ul.guiz-awards-row.guiz-awards-row-even(v-for='report in reports')
                    li.guiz-awards-title
                        a(:href="'report/' + report.id")
                            | Отчет № {{report.id}}
                        .guiz-awards-subtitle
                    li.guiz-awards-track {{ report.name }}
                    li.guiz-awards-time {{ report.date_from | date }} - {{ report.date_to | date }}
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: 'reports',
        data() {
            return {
            }
        },
        created: function () {
            this.$store.dispatch('reports');
        },
        filters: {
            date: function(str) {
                if (!str) { return '(n/a)'; }
                str = new Date(str);
                return str.getFullYear() + '-' + ((str.getMonth() < 9) ? '0' : '') + (str.getMonth() + 1) + '-' +
                    ((str.getDate() < 10) ? '0' : '') + str.getDate();
            }
        },
        computed: {
            ...mapState(["reports"])
        },
        methods: {
        }
    }
</script>