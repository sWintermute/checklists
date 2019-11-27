<template lang="pug">
    v-container
        v-data-table(
            :headers="headers"
            :items="filledLists"
            :items-per-page="-1"
            item-key="id"
            hide-default-footer
            class="elevation-1"  
        )       
            template(v-slot:body="{ items }")
                tbody
                    router-link(
                        v-for="item in items"
                        :key="item.name"
                        tag="tr"
                        :to="'response/' + item.id"
                    )
                        td {{ item.id }}
                        td(class="text-xs-right") {{ item.name }}
</template>

<script>
    import { mapGetters, mapActions} from "vuex";
    import types from "@/store/types/filledChecklists.js"

    export default {
        name: 'Checklists',
        data: () => ({
            headers: [
                {
                    text: 'ID',
                    align: 'left',
                    value: 'id'
                },
                {
                    text: 'Name',
                    value: 'name'
                },
            ]
        }),
        created() {
            this.FETCH_FILLED_CHECKLISTS();
        },
        computed: {
            ...mapGetters(["filledLists"])
        },
        methods: {
            ...mapActions([types.FETCH_FILLED_CHECKLISTS])
        }
    }
</script>
