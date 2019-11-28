<template lang="pug">
    v-container
        v-data-table(
            :headers="headers"
            :items="lists"
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
                        :to="'checklist/' + item.id"
                    )
                        td(style="width: 70px; text-align: center;") {{ item.id }}
                        td(class="text-xs-right") {{ item.name }}
</template>

<script>
    import { mapGetters, mapActions} from "vuex";
    import types from "@/store/types"

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
            this.FETCH_CHECKLISTS();
        },
        computed: {
            ...mapGetters(["lists"])
        },
        methods: {
            ...mapActions([types.FETCH_CHECKLISTS])
        }
    }
</script>
