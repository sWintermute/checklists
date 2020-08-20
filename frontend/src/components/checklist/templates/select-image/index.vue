<template lang="pug">
  v-col(
    cols="12"
  )
    ValidationProvider(v-slot="{ errors }")
      uploader(
        v-model="value"
        title="Загрузите фото"
      )
      div.v-messages.theme--light.error--text(v-if="errors[0]" role="alert")
        div.v-messages__wrapper
          div.v-messages__message.message-transition-enter-to {{ errors[0] }}
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import uploader from '@/components/checklist/Uploader.vue'

export default {
  components: {
    ValidationProvider,
    uploader
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: Array,
      default: () => []
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
