<template>
    <v-container>
        <template v-for="checklist in report.checklists">
            <v-data-table
                :items="checklist.questions"
                :items-per-page="100"
                item-key="id"
                hide-default-header
                hide-default-footer
                class="elevation-1"
            >
                <template v-slot:header>
                    <thead>
                        <tr>
                            <th>№ п/п</th>
                            <th colspan="3">Параметры</th>
                            <th>Примечание</th>
                        </tr>
                    </thead>
                </template>
                <template v-slot:body="{ items }">
                    <tbody>
                    <tr v-for="(item, i) in items" :key="item.id">
                        <td>{{ i + 1 }}</td>
                        <td>{{ item.text }}</td>
                        <td v-if="item.choices" v-for="choice in item.choices.split(';')">
                            <span v-if="!(choice === item.key_choices)" style="color: green">{{choice}}</span>
                            <span v-else style="color: red">{{choice}}</span>
                        </td>
                        <template v-else>
                            <td></td>
                            <td></td>
                        </template>
                        <td v-if="item.notes">
                            <v-card
                                class="mx-auto elevation-0"
                                style="background: rgba(0, 0, 0, 0);"
                                tile
                            >
                                <v-list-item class="flex-column" two-line >
                                    <v-list-item-content v-for="note in item.notes">
                                        <v-list-item-title>{{note.created | moment}}</v-list-item-title>
                                        <v-list-item-subtitle >
                                            <template v-for="key in note.keys">
                                                {{ key.answer }}
                                            </template>
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-card>
                        </td>
                    </tr>
                    </tbody>
                </template>
            </v-data-table>
        </template>
    </v-container>
</template>

<script>
    import { mapState, mapGetters, mapMutations } from 'vuex';
    import moment from 'moment';


    export default {
        name: "report",
        data: () => ({
            headers: [
                {
                    text: '№ п/п',
                    align: 'left',
                    value: 'id',
                },
                {
                    text: 'Параметры',
                    value: 'text'
                },
                {
                    text: 'Примечание',
                    value: 'date_to'
                },
            ]
        }),
        created: function () {
            this.$store.dispatch('report', this.$route.params.id);
        },
        computed: {
            ...mapState(["report"]),
            isLoading : function(){ return this.$store.getters.isLoading},
        },
        filters: {
            moment: function (date) {
                return moment(date).format('DD.MM.YYYY, h:mm');
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

<style scoped>
</style>