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
                    a(:href="'report/' + report.id")
                        li.guiz-awards-title
                            | Отчет № {{report.id}}
                            .guiz-awards-subtitle
                        li.guiz-awards-track {{ report.name }}
                        li.guiz-awards-time {{ report.date_from }}
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
        computed: {
            ...mapState(["reports"])
        },
        methods: {
            formatDate(report_date) {
                let date = new Date(report_date);
                let dd = date.getDate();
                if (dd < 10) dd = '0' + dd;
                let mm = date.getMonth() + 1;
                if (mm < 10) mm = '0' + mm;
                let yy = date.getFullYear() % 100;
                if (yy < 10) yy = '0' + yy;
                return dd + '.' + mm + '.' + yy;
            }
        }
    }
</script>