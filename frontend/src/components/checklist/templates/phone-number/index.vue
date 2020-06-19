<template lang="pug">
    div
        header {{ question.text }}
        ValidationProvider(:rules="question.required ? 'required' : ''" v-slot="{ errors }")
            vue-phone-number-input(
                v-model="internalValue"
                default-country-code="RU"
                :translations="translations"
                :error="!!errors[0]"
                class="mb-4"
            )
            span {{ value }}
            div.v-messages.theme--light.error--text(v-if="errors[0]" role="alert")
                div.v-messages__wrapper
                    div.v-messages__message.message-transition-enter-to {{ errors[0] }}
</template>

<script>
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

import { ValidationProvider, ValidationObserver } from "vee-validate";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    VuePhoneNumberInput
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: String,
      default: () => ""
    },
    question: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    translations: {
        countrySelectorLabel: 'Код страны',
        countrySelectorError: 'Выберите код страны',
        phoneNumberLabel: 'Номер телефона',
        example: 'Пример :'
    }
  }),
  computed: {
    internalValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  }
};
</script>