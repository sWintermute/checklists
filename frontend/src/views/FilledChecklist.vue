<template lang="pug">
    v-container(
        class="fill-height"
        fluid
    )
        v-row(
            align="center"
            justify="center"
        )
            v-col(
                cols="12"
                sm="8"
                md="4"
            )
                v-card(class="elevation-2 rounded-card" tile)
                    v-toolbar(
                        color="primary"
                        dark
                        flat
                    )
                        v-toolbar-title {{ filledList.id }}
                    v-card-text(class="px-6 pt-6 pb-0")
                      v-form
                        v-container
                          v-row
                            v-col(
                              cols="12"
                              v-for="(answer, i) in filledList.answers"
                              :key="i"
                            )
                              v-text-field(
                                :label="answer.question_text"
                                :value="answer.body"
                              )
                    v-card-actions(class="justify-center px-6")
                      v-btn(class="ma-2" tile outlined color="primary") Очистить
                      v-btn(tile color="primary" @click="") Отправить
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
