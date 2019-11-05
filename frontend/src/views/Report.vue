<template>
    <v-container fluid>
        <div v-for="(checklist, i) in report.checklists" :key="i">
            <vue-loading v-if="isLoading" type="spin" color="#28d" :size="{ width: '50px', height: '50px' }"></vue-loading>
            <v-data-table
                v-else
                :items="checklist.questions"
                :items-per-page="-1"
                item-key="id"
                hide-default-header
                hide-default-footer
                class="elevation-1 mx-auto"
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
                        
                        <template v-if="item.choices" >
                            <td v-for="(choice, i) in item.choices.split(';')" :key="i">
                                <span v-if="!(choice === item.key_choices)" style="color: green">{{choice}}</span>
                                <span v-else style="color: red">{{choice}}</span>
                            </td>
                        </template>
                        
                        <template v-else>
                            <td></td>
                            <td></td>
                        </template>
                        <td v-if="item.notes">
                            <v-list-item class="flex-column pa-0" two-line>
                                <v-list-item-content v-for="(note, i) in item.notes" :key="i" style="align-self: start !important;">
                                    <v-list-item-title>{{note.created | date}}</v-list-item-title>
                                    <v-list-item-subtitle >
                                        <template v-for="key in note.keys">
                                            {{ key.answer }}
                                        </template>
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </td>
                    </tr>
                    </tbody>
                </template>
            </v-data-table>
        </div>
    </v-container>
</template>

<script>
    import { format, compareAsc } from 'date-fns'
    import { mapActions, mapGetters } from 'vuex';
    import types from "@/store/types/reports"


    export default {
        name: "Report",
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
        created() {
            this.FETCH_REPORT(this.$route.params.id);
        },
        computed: {
            ...mapGetters(["report", "isLoading"]),
        },
        filters: {
            date(value) {
                return format(new Date(value), 'MM.dd.yyyy hh:mm')
            }
        },
        methods: {
            ...mapActions([types.FETCH_REPORT])
        }
    }
</script>
