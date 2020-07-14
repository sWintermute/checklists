<template lang="pug">
    v-container(
      fluid
      px-0
    )
      v-row(
        no-gutters
      )
        v-col
          v-data-table(
            :headers="headers"
            :items="lists"
            :items-per-page="20"
            item-key="id"
            :footer-props="{ disableItemsPerPage : true }"
            :loading="loading"
            loading-text="Загрузка данных..."
            no-data-text="Данных нет"
          )
            template(
              v-if="lists.length"
              v-slot:body="{ items }"
            )
              tbody
                router-link(
                  tag="tr"
                  v-for="item in items"
                  :key="item.name"
                  :to="'checklist/' + item.id"
                )
                  td(
                    style="width: 70px; text-align: center;"
                  ) {{ item.id }}
                  td(
                    class="text-xs-right"
                  ) {{ item.name }}
          v-divider
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Checklists',
  data: () => ({
    options: {},
    headers: [
      {
        text: 'ID',
        align: 'center',
        value: 'id',
        width: '70px',
        fixed: true
      },
      {
        text: 'Name',
        value: 'name'
      }
    ]
  }),
  computed: {
    ...mapState({
      loading: state => state.loading,
      lists: state => state.checklists.lists,
      pagination: state => {
        return {
          paginationPage: state.paginationPage,
          paginationItemsPerPage: state.paginationItemsPerPage,
          paginationCount: state.paginationCount,
          paginationNext: state.paginationNext,
          paginationPrev: state.paginationPrev,
          paginationNextLink: state.paginationNextLink,
          paginationPrevLink: state.paginationPrevLink
        }
      }
    })
  },
  watch: {
    // options: {
    //   async handler (pagination) {
    //     await this.FETCH_CHECKLISTS({
    //       pagination,
    //       currentUserPage: this.$route.query.page
    //     })
    //   },
    //   deep: true
    // }
  },
  async created () {
    await this.FETCH_CHECKLISTS()
    // const currentUserPage = this.$route.query.page
    // if (!currentUserPage || isNaN(currentUserPage) || parseInt(currentUserPage) <= 0) this.$router.replace('/?page=1')
  },
  methods: {
    ...mapActions({
      FETCH_CHECKLISTS: 'checklists/FETCH_CHECKLISTS'
    })
  }
}
</script>
