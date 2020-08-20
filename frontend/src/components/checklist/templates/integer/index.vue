<template lang="pug">
  v-col(cols="12")
    ValidationProvider(:rules="question.required ? 'required' : ''" v-slot="{ errors }")
      header {{ question.text }}
      v-text-field(
          v-model="internalValue"
          label="Введите цифры..."
          :error-messages="errors"
      )
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
  data: () => ({}),
  computed: {
    internalValue: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>
