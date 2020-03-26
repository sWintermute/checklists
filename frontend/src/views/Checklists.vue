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
            :items="lists"
            :items-per-page="-1"
            item-key="id"
            hide-default-footer
          )
              template(
                v-slot:body="{ items }"
              )
                  tbody
                      router-link(
                        tag="tr"
                        v-for="item in items"
                        :key="item.name"
                        :to="'checklist/' + item.id"
                      )
                          td(
                            style="width: 70px; text-align: center;"
                          ) {{ item.id }}
                          td(
                            class="text-xs-right"
                          ) {{ item.name }}
          v-divider
</template>

<script>
import { mapState, mapActions } from 'vuex'
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
        text: 'Name',
        value: 'name'
      }
    ]
  }),
  computed: {
    ...mapState({
      lists: state => state.checklists.lists
    })
  },
  created () {
    this.FETCH_CHECKLISTS()
  },
  methods: {
    ...mapActions([types.FETCH_CHECKLISTS])
  }
}
</script>
