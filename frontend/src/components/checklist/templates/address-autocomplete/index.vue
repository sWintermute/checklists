<template lang="pug">
    div
        header {{search}}
        v-autocomplete(
            v-model="model"
            :items="items"
            :loading="isLoading"
            :search-input.sync="search"
            color="white"
            item-text="value"
            item-value="value"
            label="Public APIs dadata"
            placeholder="Start typing to Search"
            prepend-icon="mdi-database-search"
            return-object
        )
        | {{items}}
</template>

<script>
import $ from 'jquery';
import 'suggestions-jquery';
import VueSuggestions from 'vue-suggestions';

import ApiService from "@/services/api.js";
import tokenService from "@/services/tokenService.js";
import axios from 'axios';

export default {
    name: 'address-autocomplete',
    data: () => ({
        value: '',
        coords: {
          latitude: '',
          longitude: ''
        },
        suggestions: [],
        optionss: {"locations_boost":[{"kladr_id":"4200001200000"}],"count":5},
        descriptionLimit: 60,
        entries: [],
        isLoading: false,
        model: null,
        search: null,
    }),
    created() {
        console.log(process.env)
    },
    computed: {
        fields () {
            if (!this.model) return []

            return Object.keys(this.model).map(key => {
            return {
                key,
                value: this.model[key] || 'n/a',
            }
            })
        },
        items () {
            return this.entries.map((entry) => {
                const value = entry.value.split("").filter((item) => {
                    return item !== ","
                }).join("").split(" ").filter((item) => {
                    console.log(item)
                    return  item.length > 2
                }).join(" ");
                return Object.assign({}, entry, { value });
            })
        }
    },
    watch: {
        search (val) {

            // Items have already been requested
            if (this.isLoading) return

            this.isLoading = true

            // Lazily load input items
            ApiService.setHeader(process.env.VUE_APP_DADATA_KEY);
            this.optionss.query = this.model;
            axios.post('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
                locations_boost: [{"kladr_id":"4200001200000"}],
                count: 5,
                query: "Новокузнецк " + this.search
            })
                .then(res => {
                    console.log(res, 1337);
                    this.entries = res.data.suggestions
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => (this.isLoading = false))
        },
    }
}
</script>