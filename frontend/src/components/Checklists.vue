<template>
    <v-container>
        <v-data-table
            :headers="headers"
            :items="lists"
            :items-per-page="5"
            item-key="id"
            class="elevation-1"
            :footer-props="{
                showFirstLastPage: true,
                firstIcon: 'mdi-arrow-collapse-left',
                lastIcon: 'mdi-arrow-collapse-right',
                prevIcon: 'mdi-minus',
                nextIcon: 'mdi-plus'
            }"
        >
            <template slot="item" slot-scope="props">
                <router-link tag="tr" :to="'checklist/' + props.item.id">
                    <td>{{ props.item.id }}</td>
                    <td class="text-xs-right">{{ props.item.name }}</td>
                </router-link>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
  import { mapState } from 'vuex';

export default {
    name: 'checklists',
    data: () => ({
        headers: [
            {
                text: 'ID',
                align: 'left',
                value: 'id',
            },
            {
                text: 'Name',
                value: 'name'
            },
        ]
    }),
    created: function () {
      this.$store.dispatch('lists');
    },
    computed: {
      ...mapState(["lists"])
    },
    methods: {
    }
}
</script>
