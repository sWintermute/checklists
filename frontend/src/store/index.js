import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import checklists from './modules/checklists'
import filledChecklists from './modules/filledChecklists'
import reports from './modules/reports'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  strict: debug,
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
      console.log(payload)
      state.paginationList.push(...payload)
    }
  },
  actions: {
    async getAllLists ({ commit, dispatch }, { method, action, mutation, path, params }) {
      try {
        const response = await Vue.axios({
          method,
          url: path,
          params
        })
        // debugger
        commit('SET_PAGINATION_LIST', response)
        // debugger
        if (this.state.paginationNextLink) {
          params.page = this.state.paginationNext
          await this.dispatch('getAllLists', { method, action, mutation, path, params })
          // debugger
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  modules: {
    user,
    reports,
    checklists,
    filledChecklists
  },
  plugins: debug ? [createLogger()] : []
})

export default store
