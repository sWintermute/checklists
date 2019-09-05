<template lang="pug">
    .checklists__block
        .table__title
            h3.table__title__text Отчеты
        table.table__container
            thead
                tr
                    th
                        h1 № п/п
                    th
                        h1 Название
                    th(colspan='2')
                        h1 Дата
                    th
                        h1 Количество листов
            tbody
                tr(v-for='report in reports')
                    td
                        a(:href="'checklist/' + report.id") Отчет № {{report.id}}
                    td {{ report.name }}
                    td {{ report.date_from }}
                    td {{ report.date_to }}
                    td {{ report.checklists }}
        |         {{reports}}
</template>

<script>
    import { mapState } from 'vuex';
    import axios from 'axios';

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