<template lang="pug">
    v-container(fluid)
        v-btn(
          @click="test"
          color="success"
          class="text-none"
        ) Скачать в EXCEL
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
import types from '@/store/types'
import { format } from 'date-fns'

// import Vue from 'vue'
import download from 'downloadjs'
import JsonExcel from 'vue-json-excel'
import XLSX from 'xlsx'

export default {
  name: 'Report',
  components: {
    downloadExcel: JsonExcel
  },
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
    ...mapGetters(['isLoading'])
  },
  created () {
    this.FETCH_REPORT(this.$route.params.id)
  },
  methods: {
    ...mapActions([types.FETCH_REPORT]),
    async test () {
      try {
        const { name: reportName, date_from: reportDateFrom, date_to: reportDateTo, checklists: reportChecklists } = this.report

        const dateFrom = format(new Date(reportDateFrom), 'yyyy-MM-dd HH:mm')
        const dateTo = format(new Date(reportDateTo), 'yyyy-MM-dd HH:mm')

        const wb = XLSX.utils.book_new()
        for (const checklist of reportChecklists) {
          const { id: checklistId, name: checklistName, questions: checklistQuestions } = checklist
          const rows = [
            [`Отчет ${reportName}`, `Дата ${dateFrom} - ${dateTo}`, ''],
            [`№ ${checklistId} ${checklistName}`],
            ['Вопросы', 'Варианты ответов', 'Ответы', 'Датаы']
          ]
          for (const question of checklistQuestions) {
            const { text: questionText, choices: questionChoices, notes: questionNotes } = question
            questionNotes.forEach((note) => {
              const { created: noteCreatedDate, keys: noteKeys } = note
              const endgame = noteKeys.map(({ name, answer }) => ([name, answer])).join('\n')
              rows.push([questionText, questionChoices, endgame, format(new Date(noteCreatedDate), 'yyyy-MM-dd HH:mm')])
              console.log(endgame)
            })
          }
          const wsData = XLSX.utils.json_to_sheet(rows, { skipHeader: true })
          XLSX.utils.book_append_sheet(wb, wsData, checklistName)
        }

        const str = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })
        download(str, 'test.xlsx', 'application/vnd.ms-excel')
      } catch (error) {
        console.log({ error })
      }
    }
  }
}
</script>
