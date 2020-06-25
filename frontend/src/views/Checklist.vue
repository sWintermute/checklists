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
                                div(v-for="(field, i) in questions" :key="i")
                                  phone-number(v-if="field.question.type === 'phone-number'" v-model="field.body" :question="field.question")
                                  template(v-else-if="field.question.type === 'address-autocomplete'")
                                    header {{ field.question.text }}
                                    ValidationProvider(:rules="field.question.required ? 'required' : ''" v-slot="{ errors }")
                                      v-autocomplete(
                                        v-model="field.body"
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
                                  template(v-else-if="field.question.type === 'textarea'")
                                    ValidationProvider(:rules="field.question.required ? 'required' : ''" v-slot="{ errors }")
                                      header {{ field.question.text }}
                                      v-textarea(
                                        solo
                                        label="Оставьте замечания..."
                                        class="mt-3"
                                        v-model="field.body"
                                        :error-messages="errors"
                                      )
                                  template(v-else-if="field.question.type === 'radio'")
                                    header {{ field.question.text }}
                                    ValidationProvider(:rules="field.question.required ? 'required' : ''" v-slot="{ errors }" name="")
                                      v-radio-group(
                                        v-model="field.body"
                                        :error-messages="errors"
                                      )
                                        v-radio(
                                          v-for="n in field.question.choices.split(';')"
                                          :key="n"
                                          :label="n"
                                          :value="n"
                                        )
                                      span {{ field.body }}
                                  template(v-else-if="field.question.type === 'select-image'")
                                    ValidationProvider(rules="required" v-slot="{ errors }")
                                      uploader(
                                        v-model="fileList"
                                        title="Загрузите фото"
                                        :autoUpload="false"
                                      )
                                      div.v-messages.theme--light.error--text(v-if="errors[0]" role="alert")
                                        div.v-messages__wrapper
                                          div.v-messages__message.message-transition-enter-to {{ errors[0] }}
                                  template(v-else-if="field.question.type === 'select'")
                                    ValidationProvider(rules="required" v-slot="{ errors }")
                                      header {{ field.question.text }}
                                      v-select(
                                        v-model="field.body"
                                        :items="field.question.choices.split(';')",
                                        label="Выберите вариант ответа"
                                        :error-messages="errors"
                                      )
                                  template(v-else-if="field.question.type === 'select-multiple'")
                                    header {{ field.question.text }}
                                    select-multiple(
                                      v-model="field.body"
                                      :headers="field.question.choices.split(';')"
                                    )
                                  template(v-else)
                                    ValidationProvider(:rules="field.question.required ? 'required' : ''" v-slot="{ errors }" name="")
                                      header {{ field.question.text }}
                                      v-text-field(
                                        v-model="field.body"
                                        label="Введите текст..."
                                        :error-messages="errors"
                                      )
                                      span {{ field.body }}
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
import Uploader from '@/components/checklist/Uploader.vue'
import autocomplete from '@/components/checklist/templates/address-autocomplete/index.vue'
import phoneNumber from '@/components/checklist/templates/phone-number'
import selectMultiple from '@/components/checklist/templates/select-multiple'

export default {
  name: 'Checklist',
  components: {
    Uploader,
    ValidationObserver,
    ValidationProvider,
    autocomplete,
    selectMultiple,
    phoneNumber
  },
  data: () => ({
    autocomplete: null,
    search: null,
    fileList: []
  }),
  computed: {
    // ...mapFields(`user`, { userProfile: 'userProfile' }),
    ...mapFields(`checklists`, {
      photo: 'photo',
      entries: 'entries',
      list: 'list'
    }),
    ...mapMultiRowFields(`checklists`, { questions: 'list.questions' }),
    ...mapState({
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
