<template lang="pug">
  v-col(cols="12")
    header {{ question.text }}
    ValidationProvider(:rules="question.required ? 'required' : ''" v-slot="{ errors }")
      v-radio-group(
        v-model="internalValue"
        :error-messages="errors"
      )
        v-radio(
          v-for="(choice, i) in question.choices.split(';')"
          :key="i"
          :label="choice"
          :value="choice"
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
