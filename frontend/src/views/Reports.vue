<template lang="pug">
    v-container
        v-data-table(
            :headers="headers"
            :items="reports"
            :items-per-page="-1"
            class="elevation-1"
        )
            template(v-slot:top)
                v-toolbar(flat color="white")
                    v-toolbar-title Отчеты
                    v-divider(
                        class="mx-4"
                        inset
                        vertical
                    )
                    v-spacer
                    v-dialog(v-model="dialog" max-width="500px")
                        template(v-slot:activator="{ on }")
                            v-btn(color="primary" dark class="mb-2" v-on="on") Создать отчет
                        v-card
                            v-card-title
                                span(class="headline") {{ formTitle }}
                            v-card-text
                                v-container
                                    v-row
                                        v-col(cols="12")
                                            v-text-field(v-model="editedItem.name" label="Названите отчета")
                                        v-col(cols="12")
                                            //- v-text-field(v-model="editedItem.calories" label="Дата от")
                                            v-menu(
                                                ref="menu1"
                                                v-model="menu1"
                                                :close-on-content-click="false"
                                                transition="scale-transition"
                                                offset-y
                                                max-width="290px"
                                                min-width="290px"
                                            )
                                                template(v-slot:activator="{ on }")
                                                    v-text-field(
                                                        v-model="dateFormatted"
                                                        label="Date"
                                                        hint="MM/DD/YYYY format"
                                                        persistent-hint
                                                        prepend-icon="event"
                                                        @blur="date = parseDate(dateFormatted)"
                                                        v-on="on"
                                                    )
                                                v-date-picker(v-model="editedItem.calories" no-title @input="menu1 = false")
                                                p Дата от: 
                                                    strong {{ date }}
                                        v-col(cols="12")
                                            v-text-field(v-model="editedItem.fat" label="Дата до")
                                        v-col(cols="12")
                                            v-text-field(v-model="editedItem.carbs" label="Чеклисты")

                            v-card-actions
                                v-spacer
                                v-btn(color="blue darken-1" text @click="close") Cancel
                                v-btn(color="blue darken-1" text @click="save") Save

            template(slot="item" slot-scope="{ item }")
                tr
                    td {{ item.id }}
                    td(class="text-xs-right") {{ item.name }}
                    td(class="text-xs-right") {{ item.date_from | dateFilter }} - {{ item.date_to | dateFilter }}
                    td
                        v-row(
                            align="center"
                            justify="center"
                        )
                            router-link(:to="'report/' + item.id" class="mx-2")
                                | open
                            v-icon(
                                small
                                @click="deleteItem(item)"
                            )
                                | {{open}}
</template>

<script>
    import { mapGetters, mapActions} from 'vuex';
    import types from "@/store/types/reports"
    import { mdiAccount } from '@mdi/js'


    export default {
        name: 'Reports',
        data: () => ({
            open: mdiAccount,
            date: new Date().toISOString().substr(0, 10),
            menu1: false,
            editedIndex: -1,
            dialog: false,
            headers: [
                {
                    text: '№ п/п',
                    align: 'left',
                    value: 'id',
                },
                { text: 'Название', value: 'name' },
                { text: 'Дата', value: 'date_to' },
                { text: 'Действия', value: 'action', sortable: false },
            ],
            editedItem: {
                checklists: '',
                date_from: '',
                date_to: '',
                id: 0,
                name: '',
            },
            defaultItem: {
                checklists: [],
                date_from: '',
                date_to: '',
                id: 0,
                name: '',
            },
            desserts: [],
        }),
        computed: {
            ...mapGetters(["reports"]),
            dateFormatted() {
                return this.formatDate(new Date().toISOString().substr(0, 10))
            },
            formTitle() {
                return (this.editedIndex === -1) ? 'Новый отчет' : 'Редактировать отчет'
            },
            computedDateFormatted () {
                return this.formatDate(this.date)
            },
        },
        watch: {
            dialog (val) {
                val || this.close()
            },
            date (val) {
                this.dateFormatted = this.formatDate(this.date)
            },
        },
        created() {
            this.FETCH_REPORTS()
        },
        filters: {
            dateFilter: function(str) {
                if (!str) { return '(n/a)'; }
                str = new Date(str);
                return str.getFullYear() + '-' + ((str.getMonth() < 9) ? '0' : '') + (str.getMonth() + 1) + '-' +
                    ((str.getDate() < 10) ? '0' : '') + str.getDate();
            }
        },
        methods: {
            ...mapActions([types.FETCH_REPORTS]),
            deleteItem (item) {
                const index = this.desserts.indexOf(item)
                confirm('Вы уверены?') && this.desserts.splice(index, 1)
            },
            close () {
                this.dialog = false
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                }, 300)
            },
            save () {
                if (this.editedIndex > -1) {
                    Object.assign(this.desserts[this.editedIndex], this.editedItem)
                } else {
                    this.desserts.push(this.editedItem)
                }
                this.close()
            },
            formatDate (date) {
                if (!date) return null

                const [year, month, day] = date.split('-')
                return `${month}/${day}/${year}`
            },
            parseDate (date) {
                if (!date) return null

                const [month, day, year] = date.split('/')
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
            },
        }
    }
</script>
