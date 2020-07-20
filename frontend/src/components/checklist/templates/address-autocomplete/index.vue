<template lang="pug">
  v-container(fluid pa-0 ma-0)
    header {{ header }}
    ValidationProvider(ref="validator" :rules="rules ? 'required' : ''" v-slot="{ errors }")
      v-autocomplete(
        :value="address"
        :label="address"
        :items="items"
        :search-input.sync="search"
        :error-messages="errors"
        color="white"
        item-text="value"
        item-value="value"
        dense
        full-width
        hide-no-data
        hide-selected
        @input="handleAutocompleteChange"
      )
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapFields } from 'vuex-map-fields'
import { mapActions } from 'vuex'

export default {
  name: 'AddressAutocomplete',
  components: {
    ValidationObserver,
    ValidationProvider
  },
  props: {
    header: {
      type: String,
      default: ''
    },
    rules: {
      type: Boolean,
      default: false
    },
    address: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    search: null
  }),
  computed: {
    ...mapFields('checklists', {
      entries: 'entries'
    }),
    items () {
      if (!this.entries.length) return []
      return this.entries.map((entry) => {
        const value = entry.data ? [entry.data.city, entry.data.street, entry.data.house].join(' ') : entry
        return Object.assign({}, entry, { value })
      })
    }
  },
  watch: {
    search (value, prevValue) {
      if (!value) return
      this.CHECKLIST_AUTOCOMPLETE_FIELD({ search: value })
    }
  },
  methods: {
    ...mapActions({
      CHECKLIST_AUTOCOMPLETE_FIELD: 'checklists/CHECKLIST_AUTOCOMPLETE_FIELD'
    }),
    async handleAutocompleteChange (newAddress) {
      this.$refs.validator.syncValue(newAddress)
      await this.$refs.validator.validate()
      this.$refs.validator.setFlags({
        dirty: true,
        pristine: false
      })
      this.$emit('update:address', newAddress)
    }
  }
}
</script>
