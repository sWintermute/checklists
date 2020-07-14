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
                      ValidationObserver(ref="observer" v-slot="{ handleSubmit }" tag="div")
                        v-form(@submit.prevent="handleSubmit(UPDATE_FILLED_CHECKLIST)" id="check-login-form")
                          v-container
                            v-row
                              v-col(
                                cols="12"
                                v-for="(answer, i) in answers"
                                :key="i"
                              )
                                template(v-if="answer.question.type === 'address-autocomplete'")
                                  header {{ answer.question.text }}
                                  ValidationProvider(:rules="answer.question.required ? 'required' : ''" v-slot="{ errors }")
                                    v-autocomplete(
                                      v-model="answer.body"
                                      :label="answer.body || `Введите адрес...`"
                                      :items="items"
                                      :search-input.sync="search"
                                      :error-messages="errors"
                                      color="white"
                                      item-text="value"
                                      item-value="value"
                                      dense
                                      full-width
                                    )
                                template(v-else-if="answer.question.type === 'integer'")
                                  v-text-field(
                                    v-model="answer.body"
                                    :label="answer.question.text"
                                  )
                                template(v-else-if="answer.question.type === 'text'")
                                  v-text-field(
                                    v-model="answer.body"
                                    :label="answer.question.text"
                                  )
                                template(v-else-if="answer.question.type === 'textarea'")
                                  header {{ answer.question.text }}
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
                              v-col(
                                cols="12"
                              )
                                ValidationProvider(rules="required" v-slot="{ errors }")
                                  uploader(
                                    v-model="fileList"
                                    title="Загрузите фото"
                                    :autoUpload="false"
                                  )
                                  div.v-messages.theme--light.error--text(v-if="errors[0]" role="alert")
                                    div.v-messages__wrapper
                                      div.v-messages__message.message-transition-enter-to {{ errors[0] }}
                    v-card-actions
                      v-spacer
                      v-btn(
                        tile
                        type="submit"
                        color="primary"
                        form="check-login-form"
                      ) Сохранить
</template>

<script>
import { createHelpers, mapMultiRowFields, mapFields } from 'vuex-map-fields'
import { mapState, mapActions } from 'vuex'

import { ValidationObserver, ValidationProvider } from 'vee-validate'
import Uploader from '@/components/checklist/Uploader.vue'

export default {
  name: 'FilledChecklist',
  components: {
    Uploader,
    ValidationObserver,
    ValidationProvider
  },
  data: () => ({
    fileList: [],
    search: null
  }),
  computed: {
    ...mapMultiRowFields('filledChecklists', { answers: 'filledList.answers' }),
    ...mapState({
      entries: state => state.checklists.entries,
      filledList: state => state.filledChecklists.filledList
    }),
    items () {
      if (!this.entries.length) return []
      return this.entries.map((entry) => {
        console.log(entry)
        const value = [entry.data.city, entry.data.street, entry.data.house].join(' ')

        return Object.assign({}, entry, { value })
      })
    }
  },
  watch: {
    search (value) {
      this.CHECKLIST_AUTOCOMPLETE_FIELD({ search: value })
    }
  },
  async created () {
    await this.FETCH_FILLED_CHECKLIST({
      id: this.$route.params.id
    })
  },
  methods: {
    ...mapActions({
      FETCH_FILLED_CHECKLIST: 'filledChecklists/FETCH_FILLED_CHECKLIST',
      UPDATE_FILLED_CHECKLIST: 'filledChecklists/UPDATE_FILLED_CHECKLIST',
      CHECKLIST_AUTOCOMPLETE_FIELD: 'checklists/CHECKLIST_AUTOCOMPLETE_FIELD'
    })
  }
}
</script>
