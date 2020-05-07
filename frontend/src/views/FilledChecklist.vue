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
                              template(v-if="answer.question.type === 'address-autocomplete'")
                                autocomplete(
                                  :id="answer.question.id"
                                  :title="answer.question.text"
                                )
                              template(v-else-if="answer.question.type === 'textarea'")
                                v-textarea(
                                  solo
                                  :label="answer.question.text"
                                  class="mt-3"
                                  v-model="answer.body"
                                )
                              template(v-else-if="answer.question.type === 'radio'")
                                header {{ answer.question.text }}
                                v-radio-group(v-model="answer.body")
                                  v-radio(
                                    v-for="n in answer.question.choices.split(';')"
                                    :key="n"
                                    :label="n"
                                    :value="n"
                                  )
                              template(v-else)
                                v-text-field(
                                  v-model="answer.body"
                                  :label="answer.question.text"
                                )
                            v-col(
                              cols="12"
                            )
                              uploader(
                                v-model="photo"
                                title="Загрузите фото"
                                :autoUpload="false"
                              )
                    v-card-actions
                      v-spacer
                      v-btn(tile color="primary" @click="UPDATE_FILLED_CHECKLIST") Сохранить
</template>

<script>
import { createHelpers } from "vuex-map-fields"
import { mapState, mapActions } from 'vuex'
import { mapMultiRowFields, mapFields } from 'vuex-map-fields'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import Uploader from '@/components/checklist/Uploader.vue'
import autocomplete from '@/components/checklist/templates/address-autocomplete/index.vue'

export default {
  name: 'FilledChecklist',
  components: {
    Uploader,
    ValidationObserver,
    ValidationProvider,
    autocomplete
  },
  data: () => ({}),
  computed: {
    ...mapFields(`filledChecklists`, { photo: 'filledList.photo' }),
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
