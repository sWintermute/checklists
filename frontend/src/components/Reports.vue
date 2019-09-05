<template>
    <div class="checklists__block">
        <div class="table__title">
            <h3 class="table__title__text">Отчеты</h3>
        </div>
        <table class="table__container">
            <thead>
            <tr>
                <th><h1>№ п/п</h1></th>
                <th><h1>Название</h1></th>
                <th colspan="2"><h1>Дата</h1></th>
                <th><h1>Количество листов</h1></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="report in reports">
                <td><a :href="'checklist/' + report.id">Отчет № {{report.id}}</a></td>
                <td>{{ report.name }}</td>
                <td>{{ report.date_from }}</td>
                <td v-bind:is="formatDate(report.date_to)"></td>
                <td>{{ report.checklists }}</td>
            </tr>
            </tbody>
        </table>
        {{reports}}
    </div>
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