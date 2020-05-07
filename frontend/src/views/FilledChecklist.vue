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
                        v-toolbar-title Ответ {{ filledList.id }}
                    v-card-text(class="px-6 pt-6 pb-0")
                      v-form
                        v-container
                          v-row
                            v-col(
                              cols="12"
                              v-for="(answer, i) in answers"
                              :key="i"
                            )
                              v-text-field(
                                :label="answer.question_text"
                                v-model="answer.body"
                              )
                    v-card-actions
                      v-spacer
                      v-btn(tile color="primary" @click="UPDATE_FILLED_CHECKLIST") Сохранить
</template>

<script>
import { createHelpers } from "vuex-map-fields";
import { mapState, mapActions } from 'vuex'
import { mapMultiRowFields } from 'vuex-map-fields';

export default {
  name: 'FilledChecklist',
  data: () => ({}),
  computed: {
    ...mapMultiRowFields(`filledChecklists`, { answers: 'filledList.answers' }),
    ...mapState({
      filledList: state => state.filledChecklists.filledList
    }),
    // filledList: {
    //   get () {
    //     return this.$store.state.filledChecklists.filledList
    //   },
    //   set (value) { console.log(this.$store) }
    // },
    // answers: {
    //   get () {
    //     return this.$store.state.filledChecklists.filledList.answers
    //   },
    //   set (value) { console.log(this.$store) }
    // }
  },
  created () {
    this.FETCH_FILLED_CHECKLIST({
      id: this.$route.params.id
    })
  },
  methods: {
    ...mapActions({
      FETCH_FILLED_CHECKLIST: 'filledChecklists/FETCH_FILLED_CHECKLIST',
      UPDATE_FILLED_CHECKLIST: 'filledChecklists/UPDATE_FILLED_CHECKLIST',
    }),
  }
}
</script>
