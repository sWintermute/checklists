<template lang="pug">
    v-container(fluid)
        v-card(
            v-for="(checklist, i) in report.checklists"
            :key="i"
            color="transparent"
            flat
        )
            v-card-title(class="headline text-centered") {{checklist.name}}
            v-text
                v-data-table(
                    :items="checklist.questions"
                    :items-per-page="-1"
                    item-key="id"
                    hide-default-header
                    hide-default-footer
                    class="elevation-1 mx-auto"
                )
                    template(v-slot:header)
                        thead
                            tr
                                th № п/п
                                th(colspan="3") Параметры
                                th Примечание
                    template(v-slot:body="{ items }")
                        tbody
                            tr(v-for="(item, i) in items" :key="item.id")
                                td {{ i + 1 }}
                                td {{ item.text }}

                                template(v-if="item.choices")
                                    td(v-for="(choice, i) in item.choices.split(';')" :key="i")
                                        span(v-if="!(choice === item.key_choices)" style="color: red") {{choice}}
                                        span(v-else style="color: green") {{choice}}
                                
                                template(v-else)
                                    td
                                    td
                                    
                                td(v-if="item.notes")
                                    v-list-item(class="flex-column pa-0" two-line)
                                        v-list-item-content(
                                            v-for="(note, i) in item.notes"
                                            :key="i"
                                            style="align-self: start !important;"
                                        )
                                            v-list-item-title {{note.created | date}}
                                            v-list-item-subtitle
                                                template(v-for="key in note.keys")
                                                    | {{ key.answer }}
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
