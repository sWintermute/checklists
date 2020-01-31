<template lang="pug">
    v-container(
      fluid
      px-0
    )
      v-row(
        no-gutters
      )
        v-col
          v-data-table(
            :headers="headers"
            :items="reports"
            :items-per-page="-1"
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
                      v-dialog(v-model="dialog" max-width="700px")
                          template(v-slot:activator="{ on }")
                              v-btn(
                                color="primary"
                                tile
                                dark
                                class="mb-2"
                                v-on="on"
                              ) Создать отчет
                          v-card
                              v-card-title
                                  span(class="headline") Создание нового отчета
                              v-card-text
                                  v-container
                                      v-row(no-gutters)
                                          v-col(cols="12")
                                              v-text-field(v-model="editedItem.name" label="Названите отчета")
                                          v-col(cols="12")
                                              v-select(
                                                  v-model="editedItem.checklists"
                                                  :items="lists"
                                                  :menu-props="{ maxHeight: '400' }"
                                                  label="Чеклисты"
                                                  multiple
                                                  persistent-hint
                                                  item-text="name"
                                                  item-value="id"
                                              )
                                                  template(v-slot:selection="{ item, index }")
                                                      v-chip(v-if="index === 0")
                                                          span {{ item.name }}
                                                      span(
                                                          v-if="index === 1"
                                                          class="grey--text caption"
                                                      ) (+{{ editedItem.checklists.length - 1 }} других)

                                                  template(v-slot:prepend-item)
                                                      v-list-item(
                                                          ripple
                                                          @click="toggle"
                                                      )
                                                          v-list-item-action
                                                              v-icon(:color="selectedChecklists.length > 0 ? 'primary' : ''") {{ icon }}
                                                          v-list-item-content
                                                              v-list-item-title Выбрать все
                                                      v-divider(class="mt-2")
                                          v-col(cols="12")
                                              v-row(no-gutters)
                                                  v-col(cols="12")
                                                      v-text-field(
                                                          v-model="dateRangeText"
                                                          label="Дата"
                                                          readonly
                                                      )
                                                  v-col(cols="12" class="d-flex justify-center")
                                                      v-date-picker(v-model="dates" range landscape full-width)
                              v-card-actions
                                  v-spacer
                                  v-btn(color="blue darken-1" text @click="close") Закрыть
                                  v-btn(color="blue darken-1" text @click="sendReport") Создать

              template(slot="item" slot-scope="{ item }")
                  tr
                      td(style="width: 70px; text-align: center;") {{ item.id }}
                      td(class="text-xs-right")
                          router-link(:to="'report/' + item.id" class="mx-2")
                              | {{ item.name }}
                      td(class="text-xs-right") {{ item.date_from | date }} - {{ item.date_to | date }}
                      td
                          v-row(
                              align="center"
                              justify="center"
                          )
                            v-col
                              v-btn(
                                color="error"
                                class="custom-transform-class text-none"
                                text
                                tile
                                @click="deleteItem(item)"
                              )
                                v-icon(
                                  class="mr-1 mb-1"
                                  small
                                )
                                  | {{ mdiDelete }}
                                | Удалить отчет
</template>

<script>
import { format } from 'date-fns'
import { mapState, mapGetters, mapActions } from 'vuex'
import types from '@/store/types'
import {
  mdiAccount,
  mdiDelete,
  mdiCheckboxBlankOutline,
  mdiMinusBox,
  mdiCloseBox,
  mdiCalendarClock
} from '@mdi/js'

export default {
  name: 'Reports',
  data: () => ({
    mdiAccount,
    mdiDelete,
    mdiCheckboxBlankOutline,
    mdiMinusBox,
    mdiCloseBox,
    mdiCalendarClock,
    date: new Date().toISOString().substr(0, 10),
    dates: ['2019-09-10', '2019-09-20'],
    menu1: false,
    editedIndex: -1,
    dialog: false,
    headers: [
      { text: '№ п/п', align: 'left', value: 'id' },
      { text: 'Название', value: 'name' },
      { text: 'Дата', value: 'date_to' },
      { text: 'Действия', value: 'action', sortable: false }
    ],
    editedItem: {
      name: '',
      date_from: '',
      date_to: '',
      checklists: []
    },
    defaultItem: {
      checklists: [],
      dates: ['2019-09-10', '2019-09-20'],
      name: ''
    },
    selectedChecklists: []
  }),
  computed: {
    ...mapState({
      reports: state => state.reports.reports,
      lists: state => state.checklists.lists
    }),
    ...mapGetters(['namesLists']),
    selectedAllChecklists () {
      return this.editedItem.checklists.length === this.lists.length
    },
    selectedSomeChecklists () {
      return this.editedItem.checklists.length > 0 && !this.selectedAllChecklists
    },
    icon () {
      if (this.selectedAllChecklists) return this.mdiCloseBox
      if (this.selectedSomeChecklists) return this.mdiMinusBox
      return this.mdiCheckboxBlankOutline
    },
    dateRangeText () {
      return this.defaultItem.dates.join(' ~ ')
    },
    dateFormatted () {
      return this.formatDate(new Date().toISOString().substr(0, 10))
    },
    formTitle () {
      return (this.editedIndex === -1) ? 'Новый отчет' : 'Редактировать отчет'
    },
    computedDateFormatted () {
      return this.formatDate(this.date)
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    date () {
      this.dateFormatted = this.formatDate(this.date)
    },
    dates (val) {
      if (val.length === 2) {
        this.editedItem.date_from = format(new Date(val[0] + ' 00:00:00'), "yyyy-MM-dd'T'hh:mm:ss")
        this.editedItem.date_to = format(new Date(val[1] + ' 00:00:00'), "yyyy-MM-dd'T'hh:mm:ss")
      }
    }
  },
  created () {
    this.FETCH_REPORTS()
    this.FETCH_CHECKLISTS()
  },
  methods: {
    ...mapActions([
      types.FETCH_REPORTS,
      types.CREATE_REPORT,
      types.FETCH_CHECKLISTS,
      types.REMOVE_REPORT
    ]),
    sendReport () {
      this.CREATE_REPORT(this.editedItem)
      this.close()
    },
    toggle () {
      this.$nextTick(() => {
        if (this.selectedAllChecklists) {
          this.editedItem.checklists = []
        } else {
          this.editedItem.checklists = this.namesLists
        }
      })
    },
    deleteItem (item) {
      confirm('Вы уверены?')
      this.REMOVE_REPORT(item.id)
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    formatDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    }
  }
}
</script>
