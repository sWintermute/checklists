<template lang="pug">
    v-container(
      fluid
      px-0
    )
      v-row(
        no-gutters
      )
        v-col
          | {{ filledList }}
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
      filledList: state => state.filledChecklists.filledList
    })
  },
  created () {
    this.FETCH_FILLED_CHECKLIST({
      id: this.$route.params.id
    })
  },
  methods: {
    ...mapActions([types.FETCH_FILLED_CHECKLIST])
  }
}
</script>
