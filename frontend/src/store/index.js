import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import checklists from './modules/checklists'
import filledChecklists from './modules/filledChecklists'
import reports from './modules/reports'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    status: '',
    loading: false,
    paginationPage: 1,
    paginationItemsPerPage: 10,
    paginationCount: 0,
    paginationNext: 0,
    paginationPrev: 0,
    paginationNextLink: '',
    paginationPrevLink: '',
    paginationRouterPush: false,
    paginationList: []
  },
  getters: {
    isLoading: state => state.loading
  },
  mutations: {
    SET_PAGINATION_ROUTER_PUSH: (state, payload) => {
      state.paginationRouterPush = payload
    },
    SET_LOADING_STATUS: (state, payload) => {
      state.loading = payload
    },
    SET_PAGINATION: (state, { page, itemsPerPage, count, next, prev, nextLink, prevLink }) => {
      state.paginationPage = page
      state.paginationItemsPerPage = itemsPerPage
      state.paginationCount = count
      state.paginationNext = next
      state.paginationPrev = prev
      state.paginationNextLink = nextLink
      state.paginationPrevLink = prevLink
    },
    SET_PAGINATION_LIST (state, payload) {
      state.paginationList = payload
    }
  },
  actions: {
    async getAllLists ({ commit, dispatch }, { method, action, mutation }) {
      console.log(this.state.paginationNextLink)
      if (this.state.paginationNextLink) {
        const response = await Vue.axios({
          method,
          url: this.state.paginationNext
        })
        console.log(response, this.state.paginationNextLink)
        commit('SET_PAGINATION_LIST', response)
        // if (action) dispatch(action)
        console.log(this)
      }
    }
  },
  modules: {
    user,
    reports,
    checklists,
    filledChecklists
  }
})

export default store
