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
                        v-toolbar-title {{ list.name }}
                    v-card-text(class="px-6 pt-6 pb-0")
                        ValidationObserver(ref="observer" v-slot="{ handleSubmit }" tag="div")
                            v-form(@submit.prevent="handleSubmit(sendChecklist)" id="check-login-form")
                                div(v-for="(question, i) in list.questions" :key="i")
                                    template(v-if="question.type === 'phone-number'")
                                      header {{ question.text }}
                                      ValidationProvider(:rules="question.required ? 'required' : ''" v-slot="{ errors }")
                                        vue-phone-number-input(
                                          v-model="answers[question.id]"
                                          default-country-code="RU"
                                          :translations="translations"
                                          :error="!!errors[0]"
                                          class="mb-4"
                                        )
                                        div.v-messages.theme--light.error--text(v-if="errors[0]" role="alert")
                                          div.v-messages__wrapper
                                            div.v-messages__message.message-transition-enter-to {{ errors[0] }}
                                    template(v-else-if="question.type === 'address-autocomplete'")
                                      header {{ question.text }}
                                      ValidationProvider(:rules="question.required ? 'required' : ''" v-slot="{ errors }")
                                        v-autocomplete(
                                          v-model="answers[question.id]"
                                          :items="autocompleteItems"
                                          :search-input.sync="search"
                                          :error-messages="errors"
                                          color="white"
                                          item-text="value"
                                          item-value="value"
                                          dense
                                          full-width
                                          hide-no-data
                                          hide-selected
                                          ref="myComboBox"
                                        )
                                          template(v-slot="label")
                                            | {{search}}
                                    template(v-else-if="question.type === 'textarea'")
                                      ValidationProvider(:rules="question.required ? 'required' : ''" v-slot="{ errors }")
                                        header {{ question.text }}
                                        v-textarea(
                                          solo
                                          label="Оставьте замечания..."
                                          class="mt-3"
                                          v-model="answers[question.id]"
                                          :error-messages="errors"
                                        )
                                    template(v-else-if="question.type === 'radio'")
                                      header {{ question.text }}
                                      ValidationProvider(:rules="question.required ? 'required' : ''" v-slot="{ errors }" name="")
                                        v-radio-group(v-model="answers[question.id]" :error-messages="errors")
                                          v-radio(
                                            v-for="n in question.choices.split(';')"
                                            :key="n"
                                            :label="n"
                                            :value="n"
                                          )
                                    template(v-else-if="question.type === 'select-image'")
                                      ValidationProvider(rules="required" v-slot="{ errors }")
                                        uploader(
                                          v-model="fileList"
                                          title="Загрузите фото"
                                          :autoUpload="false"
                                        )
                                        div.v-messages.theme--light.error--text(v-if="errors[0]" role="alert")
                                          div.v-messages__wrapper
                                            div.v-messages__message.message-transition-enter-to {{ errors[0] }}
                                    template(v-else-if="question.type === 'select'")
                                      ValidationProvider(rules="required" v-slot="{ errors }")
                                        v-select(
                                          v-model="answers[question.id]"
                                          :items="question.choices.split(';')",
                                          label="Выберите вариант ответа"
                                          :error-messages="errors"
                                        )
                                    template(v-else)
                                      ValidationProvider(:rules="question.required ? 'required' : ''" v-slot="{ errors }" name="")
                                        header {{ question.text }}
                                        v-text-field(
                                          v-model="answers[question.id]"
                                          label="Введите текст..."
                                          :error-messages="errors"
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
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapState, mapActions } from 'vuex'

import Uploader from '@/components/checklist/Uploader.vue'
import autocomplete from '@/components/checklist/templates/address-autocomplete/index.vue'

export default {
  name: 'Checklist',
  components: {
    Uploader,
    ValidationObserver,
    ValidationProvider,
    autocomplete,
    VuePhoneNumberInput
  },
  data: () => ({
    autocomplete: null,
    search: null,
    fileList: [],
    answers: {},
    choices: {},
    toggleChecked: false,
    translations: {
        countrySelectorLabel: 'Код страны',
        countrySelectorError: 'Выберите код страны',
        phoneNumberLabel: 'Номер телефона',
        example: 'Пример :'
    }
  }),
  computed: {
    ...mapState({
      entries: state => state.checklists.entries,
      list: state => state.checklists.list,
      userProfile: state => state.user.userProfile
    }),
    autocompleteItems () {
      if (!this.entries.length) return []
      return this.entries.map((entry) => {
        const value = entry.data ? [entry.data.city, entry.data.street, entry.data.house].join(' ') : entry
        return Object.assign({}, entry, { value })
      })
    },
  },
  watch: {
    search (value, prevValue) {
      if (!value) return
      this.CHECKLIST_AUTOCOMPLETE_FIELD({ search: value })
    },
  },
  created () {
    this.FETCH_CHECKLIST(this.$route.params.id)
  },
  methods: {
    ...mapActions({
        FETCH_CHECKLIST: 'checklists/FETCH_CHECKLIST',
        SEND_CHECKLIST: 'checklists/SEND_CHECKLIST',
        CHECKLIST_AUTOCOMPLETE_FIELD: 'checklists/CHECKLIST_AUTOCOMPLETE_FIELD'
    }),
    sendChecklist () {
      this.$store.commit('checklists/SET_ANSWERS', this.answers)
      this.SEND_CHECKLIST({
        fileList: this.fileList,
        userProfile: this.userProfile,
        listId: this.$route.params.id
      })
    }
  }
}
</script>
