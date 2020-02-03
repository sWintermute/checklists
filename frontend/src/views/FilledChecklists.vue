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
              :items-per-page="-1"
              item-key="id"
              hide-default-footer
          )
              template(v-slot:body="{ items }")
                  tbody
                      //- router-link(v-for="(item, i) in items" :key="i" tag="tr" :to="'response/' + item.id + '/'")
                      tr(v-for="(item, i) in items" :key="i")
                        td {{ item.id }}
                        td(class="text-xs-right") {{ item.created | date }}
                        td(class="text-xs-right") {{ item.updated | date }}
                        td(v-text="test(item.survey)")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import types from '@/store/types'

export default {
  name: 'Checklists',
  data: () => ({
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
        text: 'Дата последнего редактирования',
        value: 'updated'
      },
      {
        text: 'Чеклист',
        value: 'survey'
      }
    ]
  }),
  computed: {
    ...mapState({
      filledLists: state => state.filledChecklists.filledLists,
      lists: state => state.checklists.lists
    })
  },
  created () {
    this.FETCH_FILLED_CHECKLISTS()
    this.FETCH_CHECKLISTS()
  },
  methods: {
    ...mapActions([types.FETCH_FILLED_CHECKLISTS, types.FETCH_CHECKLISTS]),
    test (survey) {
      return this.lists.find(checklist => checklist.id === survey).name;
    }
  }
}
</script>
