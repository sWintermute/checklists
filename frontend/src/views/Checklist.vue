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
                sm="12"
                md="4"
                lg="3"
                class="pa-0"
            )
                v-card(class="elevation-2 rounded-card" tile)
                    v-toolbar(
                        color="primary"
                        dark
                        flat
                    )
                        v-toolbar-title {{ list.name }}
                    v-card-text(class="px-6 pt-6 pb-0")
                        ValidationObserver(ref="observer" v-slot="{ handleSubmit }" tag="div")
                            v-form(@submit.prevent="handleSubmit(sendChecklist)" id="check-login-form")
                                v-row(v-for="({ question, body }, i) in questions" :key="i")
                                  span {{question.type}} - {{body}}
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
                                    v-model="question.body"
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
                    v-card-actions(class="justify-center pa-6")
                        v-spacer
                        v-btn(
                          tile
                          type="submit"
                          color="primary"
                          form="check-login-form"
                        ) Отправить
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapState, mapActions } from 'vuex'
import { mapMultiRowFields, mapFields } from 'vuex-map-fields'

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
  name: 'Checklist',
  components: {
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
    fileList: []
  }),
  computed: {
    ...mapFields('checklists', {
      photo: 'photo',
      list: 'list'
    }),
    ...mapMultiRowFields('checklists', { questions: 'list.questions' }),
    ...mapState({
      userProfile: state => state.user.userProfile
    })
  },
  created () {
    this.FETCH_CHECKLIST(this.$route.params.id)
  },
  methods: {
    ...mapActions({
      FETCH_CHECKLIST: 'checklists/FETCH_CHECKLIST',
      SEND_CHECKLIST: 'checklists/SEND_CHECKLIST'
    }),
    async sendChecklist () {
      // this.$store.commit('checklists/SET_field.bodyS', this.field.bodys)
      await this.SEND_CHECKLIST({
        fileList: this.fileList,
        userProfile: this.userProfile
      })
    }
  }
}
</script>
