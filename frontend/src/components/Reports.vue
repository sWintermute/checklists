<template>
    <v-container>
        <v-data-table
                :headers="headers"
                :items="reports"
                :items-per-page="5"
                item-key="id"
                hide-default-footer
                class="elevation-1"
        >
            <template slot="item" slot-scope="props">
                <router-link tag="tr" :to="'report/' + props.item.id">
                    <td>{{ props.item.id }}</td>
                    <td class="text-xs-right">{{ props.item.name }}</td>
                    <td class="text-xs-right">{{ props.item.date_from | date }} - {{ props.item.date_to | date }}</td>
                </router-link>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: 'reports',
        data: () => ({
            headers: [
                {
                    text: '№ п/п',
                    align: 'left',
                    value: 'id',
                },
                {
                    text: 'Название',
                    value: 'name'
                },
                {
                    text: 'Дата',
                    value: 'date_to'
                },
            ]
        }),
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