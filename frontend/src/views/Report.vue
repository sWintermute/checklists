<template lang="pug">
    v-container(fluid)
        v-card(
            v-for="(checklist, i) in report.checklists"
            :key="i"
            color="transparent"
            flat
        )
            v-card-title(class="headline text-centered") {{checklist.name}}
            v-card-text
                v-data-table(
                    :items="checklist.questions"
                    :items-per-page="-1"
                    item-key="id"
                    hide-default-header
                    hide-default-footer
                    class="elevation-1 mx-auto"
                    sort-by="id"
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
                                            v-list-item-title {{ note.created | date }}
                                            v-list-item-subtitle
                                                template(v-for="key in note.keys")
                                                    | {{ key.answer }};&nbsp;
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'Report',
  data: () => ({
    qwe: null,
    json_fields: {
      Номер: 'id',
      Название: 'name',
      'Дата создания': 'date_from',
      'Дата закрытия': 'date_to'
    },
    headers: [
      {
        text: '№ п/п',
        align: 'left',
        value: 'id'
      },
      {
        text: 'Параметры',
        value: 'text'
      },
      {
        text: 'Примечание',
        value: 'date_to'
      }
    ]
  }),
  computed: {
    ...mapState({
      report: state => state.reports.report
    }),
    ...mapGetters({
      isLoading: 'isLoading'
    })
  },
  created () {
    this.FETCH_REPORT(this.$route.params.id)
  },
  methods: {
    ...mapActions({
      FETCH_REPORT: 'reports/FETCH_REPORT'
    })
  }
}
</script>
