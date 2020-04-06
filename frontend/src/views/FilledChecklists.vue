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
              :items="filledLists"
              item-key="id"
          )
            template(v-slot:top)
              v-toolbar(flat color="white")
                  v-toolbar-title Ответы
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
                          ) Создать excel
                      v-card
                          v-card-text
                              v-container
                                  v-row(no-gutters)
                                    ValidationObserver(v-slot="{ passes }")
                                      form
                                        v-col(cols="12")
                                          ValidationProvider(
                                            name="чеклисты"
                                            rules="required"
                                            v-slot="{ errors }"
                                          )
                                            v-select(
                                                v-model="editedItem.checklists"
                                                :items="lists"
                                                :error-messages="errors"
                                                :menu-props="{ maxHeight: '400' }"
                                                label="Чеклист"
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
                                        v-col(cols="12")
                                            v-row(no-gutters)
                                                v-col(cols="12")
                                                    v-text-field(
                                                      v-model="dateRangeText"
                                                      label="Дата"
                                                      readonly
                                                    )
                                                v-col(cols="12" class="d-flex justify-center")
                                                  v-date-picker(v-model="dates" range landscape full-width :show-current="date")
                          v-card-actions
                            v-spacer
                            v-btn(color="blue darken-1" text @click="close") Закрыть
                            v-btn(color="blue darken-1" text @click="sendReport") Создать
            template(v-slot:body="{ items }")
              tbody
                //- router-link(v-for="(item, i) in items" :key="i" tag="tr" :to="'response/' + item.id + '/'")
                tr(v-for="(item, i) in items" :key="i")
                  td {{ item.id }}
                  td(class="text-xs-right") {{ item.created | date }}
                  td(v-text="test(item.survey)")
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { format } from 'date-fns'
import { mapState, mapActions } from 'vuex'
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
  name: 'Checklists',
  components: {
    ValidationObserver,
    ValidationProvider
  },
  data: () => ({
    mdiAccount,
    mdiDelete,
    mdiCheckboxBlankOutline,
    mdiMinusBox,
    mdiCloseBox,
    mdiCalendarClock,
    headers: [
      {
        text: 'ID',
        align: 'left',
        value: 'id'
      },
      {
        text: 'Дата создания',
        value: 'created'
      },
      {
        text: 'Чеклист',
        value: 'survey'
      }
    ],
    date: new Date().toISOString().substr(0, 10),
    dates: [],
    menu1: false,
    editedIndex: -1,
    dialog: false,
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
      filledLists: state => state.filledChecklists.filledLists,
      lists: state => state.checklists.lists
    }),
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
      return this.dates.join(' ~ ')
    },
    dateFormatted () {
      return this.formatDate(new Date().toISOString().substr(0, 10))
    },
    computedDateFormatted () {
      return this.formatDate(this.date)
    }
  },
  async created () {
    await this.FETCH_CHECKLISTS()
    await this.FETCH_FILLED_CHECKLISTS()
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    dates (val) {
      if (val.length === 2) {
        this.editedItem.date_from = format(new Date(val[0] + ' 00:00:00'), "yyyy-MM-dd'T'hh:mm:ss")
        this.editedItem.date_to = format(new Date(val[1] + ' 00:00:00'), "yyyy-MM-dd'T'hh:mm:ss")
      }
    }
  },
  methods: {
    ...mapActions([types.FETCH_FILLED_CHECKLISTS, types.FETCH_CHECKLISTS, types.CREATE_EXCEL]),
    toggle () {
      this.$nextTick(() => {
        if (this.selectedAllChecklists) {
          this.editedItem.checklists = []
        } else {
          this.editedItem.checklists = this.namesLists
        }
      })
    },
    test (survey) {
      return this.lists.find(checklist => checklist.id === survey).name
    },
    close () {
      this.dialog = false
    },
    sendReport () {
      this.CREATE_EXCEL({ excelData: this.editedItem })
      this.close()
    },
  }
}
</script>
