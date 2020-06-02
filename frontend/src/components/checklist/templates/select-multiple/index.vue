<template lang="pug">
    div
      validation-provider(
        v-for="(header, i) in headers"
        :key="i"
        rules="required"
        v-slot="{ errors }"
      )
        v-checkbox(
            v-model="internalValue"
            multiple
            :value="header"
            :label="header"
            :error-messages="errors"
            hide-details
        )
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  }, 
  data: () => ({}),
  mounted() {},
  props: {
    value: {
      type: String,
      default: () => ""
    },
    headers: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    internalValue: {
      get() {
        return this.value.split(";");
      },
      set(value) {
        const selectedHeaders = this.headers
          .filter(header => value.includes(header))
          .join(";");
        this.$emit("input", selectedHeaders);
      }
    }
  }
};
</script>