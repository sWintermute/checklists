<template lang="pug">
    div
        header {{ title }}
        v-autocomplete(
            v-model="autocomplete"
            :items="items"
            :loading="isLoading"
            :search-input.sync="search"
            color="white"
            item-text="value"
            item-value="value"
            placeholder="Введите адрес..."
            return-object
            cache-items
            dense
            full-width
            @input="tesrt"
        )
</template>

<script>
import ApiService from "@/services/api.js";
import tokenService from "@/services/tokenService.js";
import axios from 'axios';
import types from "@/store/types"
import { mapState, mapActions, commit } from "vuex";

export default {
    name: 'address-autocomplete',
    props: {
        title: String,
        id: Number
    },
    data: () => ({
        ...mapState(["autocomplete"]),
        count: 5,
        value: '',
        isLoading: false,
        model: null,
        search: null,
        entries: [],
    }),
    mounted() {
        this.$store.commit("SET_TEST", this.id);
    },
    computed: {
        model: {
            get() { return this.model },
            set() { return null }
        },
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
                const value = [entry.data.city, entry.data.street, entry.data.house].join(" ");
                return Object.assign({}, entry, { value });
            })
        }
    },
    watch: {
        search (val) {
            if (this.isLoading) return
            this.isLoading = true
            ApiService.setHeader(process.env.VUE_APP_DADATA_KEY);
            ApiService.post('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
                count: this.count,
                query: "Кемеровская область - Кузбасс," + this.search
            })
                .then(res => {
                    this.entries = res.data.suggestions;
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => (this.isLoading = false))
        },
    },
    methods: {
        ...mapActions([types.CHECKLIST_AUTOCOMPLETE_FIELD]),
        tesrt() {
            this.$store.commit("SET_AUTOCOMPLETE", this.autocomplete);
        }
    }
}
</script>