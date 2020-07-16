<template lang="pug">
  v-container(fluid pa-0 ma-0)
    header {{ header }}
    ValidationProvider(:rules="rules ? 'required' : ''" v-slot="{ errors }")
      v-autocomplete(
        v-model="body"
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
      )
        template(v-slot="label")
          | {{search}}
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
    body: {
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
    })
  }
}
</script>
