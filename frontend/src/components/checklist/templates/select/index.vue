<template lang="pug">
  v-col(cols="12")
    ValidationProvider(rules="required" v-slot="{ errors }")
      header {{ question.text }}
      v-select(
        v-model="internalValue"
        :items="question.choices.split(';')",
        label="Выберите вариант ответа"
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
