import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import checklists from './modules/checklists'
import filledChecklists from './modules/filledChecklists'
import reports from './modules/reports'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  state: {
    status: '',
    loading: false,
  },
  getters: {
    isLoading: state => state.loading
  },
  mutations: {
    SET_LOADING_STATUS: (state, payload) => {
      state.loading = payload
    }
  },
  modules: {
    user,
    reports,
    checklists,
    filledChecklists,
  }
})

export default store
