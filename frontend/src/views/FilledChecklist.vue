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
                        v-form(
                          @submit.prevent="handleSubmit(UPDATE_FILLED_CHECKLIST({ fileList }))"
                          id="check-login-form"
                        )
                          v-container
                            v-row
                              v-col(
                                cols="12"
                                v-for="({ question, body, id }) in answers"
                                :key="id"
                              )
                                checklist-address(
                                  v-if="question.type === 'address-autocomplete'"
                                  :question="question"
                                  :address="body"
                                  v-on:update:address="body = $event"
                                )
                                checklist-integer(
                                  v-else-if="question.type === 'integer'"
                                  :question="question"
                                  v-model="body"
                                )
                                checklist-phone(
                                  v-else-if="question.type === 'phone-number'"
                                  :question="question"
                                  v-model="body"
                                )
                                checklist-radio(
                                  v-else-if="question.type === 'radio'"
                                  :question="question"
                                  v-model="body"
                                )
                                checklist-select(
                                  v-else-if="question.type === 'select'"
                                  :question="question"
                                  v-model="body"
                                )
                                checklist-image(
                                  v-else-if="question.type === 'select-image'"
                                  :question="question"
                                  v-model="body"
                                )
                                checklist-multiple(
                                  v-else-if="question.type === 'select-multiple'"
                                  :question="question"
                                  v-model="body"
                                )
                                checklist-text(
                                  v-else-if="question.type === 'text'"
                                  :question="question"
                                  v-model="body"
                                )
                                checklist-textarea(
                                  v-else-if="question.type === 'textarea'"
                                  :question="question"
                                  v-model="body"
                                )
                              //- v-col(
                              //-   cols="12"
                              //- )
                              //-   ValidationProvider(v-slot="{ errors }")
                              //-     uploader(
                              //-       v-model="photo"
                              //-       title="Загрузите фото"
                              //-       :autoUpload="false"
                              //-     )
                              //-     span {{ photo }}
                              //-     div.v-messages.theme--light.error--text(v-if="errors[0]" role="alert")
                              //-       div.v-messages__wrapper
                              //-         div.v-messages__message.message-transition-enter-to {{ errors[0] }}
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

const ChecklistAddress = () => import('@/components/checklist/templates/address-autocomplete')
const ChecklistInteger = () => import('@/components/checklist/templates/integer')
const ChecklistPhone = () => import('@/components/checklist/templates/phone-number')
const ChecklistRadio = () => import('@/components/checklist/templates/radio')
const ChecklistSelect = () => import('@/components/checklist/templates/select')
const ChecklistImage = () => import('@/components/checklist/templates/select-image')
const ChecklistMultiple = () => import('@/components/checklist/templates/select-multiple')
const ChecklistText = () => import('@/components/checklist/templates/text')
const ChecklistTextarea = () => import('@/components/checklist/templates/textarea')

export default {
  name: 'FilledChecklist',
  components: {
    Uploader,
    ValidationObserver,
    ValidationProvider,

    ChecklistAddress,
    ChecklistInteger,
    ChecklistPhone,
    ChecklistRadio,
    ChecklistSelect,
    ChecklistImage,
    ChecklistMultiple,
    ChecklistText,
    ChecklistTextarea
  },
  data: () => ({
    fileList: [],
    search: null
  }),
  computed: {
    ...mapMultiRowFields('filledChecklists', { answers: 'filledList.answers' }),
    ...mapState({
      filledList: state => state.filledChecklists.filledList
    }),
    photo: {
      get: function () {
        return this.$store.getters['filledChecklists/getPhoto']
        // return ['http://localhost:8000/static/blue-tick2.png']
      },
      set: function (newPhoto) {
        // console.log(this, newPhotos)
        this.$store.commit('filledChecklists/SET_PHOTO', this.fileList)
      }
    }
  },
  watch: {
    photo: ''
  },
  async created () {
    await this.FETCH_FILLED_CHECKLIST({
      id: this.$route.params.id
    })
    this.fileList = [...this.filledList.photo]
  },
  methods: {
    ...mapActions({
      FETCH_FILLED_CHECKLIST: 'filledChecklists/FETCH_FILLED_CHECKLIST',
      UPDATE_FILLED_CHECKLIST: 'filledChecklists/UPDATE_FILLED_CHECKLIST'
    })
  }
}
</script>
