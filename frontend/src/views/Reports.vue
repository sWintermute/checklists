<template lang="pug">
    v-container
        v-data-table(
            :headers="headers"
            :items="reports"
            :items-per-page="-1"
            item-key="id"
            hide-default-footer
            class="elevation-1"
        )
            template(slot="item" slot-scope="props")
                router-link(tag="tr" :to="'report/' + props.item.id")
                    td {{ props.item.id }}
                    td(class="text-xs-right") {{ props.item.name }}
                    td(class="text-xs-right") {{ props.item.date_from | date }} - {{ props.item.date_to | date }}
                    td
                        v-row(
                            align="center"
                            justify="center"
                        )
                            v-icon(@click="editReport(item)")
                                | mdi-pencil
                            div(class="mx-2")
                            v-icon(@click="deleteReport(item)")
                                | mdi-delete

                            div(class="mx-2")
                            v-btn(
                                class="text-capitalize"
                                color="primary"
                                :to="'checklist/'"
                                depressed
                            )
                                v-icon(@click="createReport(item)")
                                    | mdi-plus-box
                                div(class="mx-2")
                                | Создать Отчет
</template>

<script>
    import { mapGetters, mapActions} from 'vuex';
    import types from "@/store/types/reports"

    export default {
        name: 'Reports',
        data: () => ({
            headers: [
                {
                    text: '№ п/п',
                    align: 'left',
                    value: 'id',
                },
                { text: 'Название', value: 'name' },
                { text: 'Дата', value: 'date_to' },
                { text: 'Действия', value: 'action', sortable: false },
            ]
        }),
        created() {
            this.FETCH_REPORTS()
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
            ...mapGetters(["reports"])
        },
        methods: {
            ...mapActions([types.FETCH_REPORTS]),
            createReport() {},
            deleteReport() {},
            editReport() {},
        }
    }
</script>
