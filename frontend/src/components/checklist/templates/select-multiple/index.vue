<template lang="pug">
  v-col(cols="12")
    header {{ question.text }}
    ValidationProvider(
      rules="required"
      v-slot="{ errors }"
    )
      v-checkbox(
        v-for="(header, i) in value"
        :key="i"
        v-model="internalValue"
        multiple
        :value="header"
        :label="header"
        :error-messages="errors"
        hide-details
      )
      div.v-messages.theme--light.error--text.mt-2(v-if="errors[0]" role="alert")
        div.v-messages__wrapper
          div.v-messages__message.message-transition-enter-to {{ errors[0] }}
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
  components: {
    ValidationProvider
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: String,
      default: () => ''
    },
    question: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    internalValue: {
      get () {
        return this.value.split(';')
      },
      set (value) {
        const selectedHeaders = this.headers
          .filter(header => value.includes(header))
          .join(';')
        this.$emit('input', selectedHeaders)
      }
    }
  }
}
</script>
