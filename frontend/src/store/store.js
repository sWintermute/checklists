import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user'
import checklists from './modules/checklists'
import reports from './modules/reports'

Vue.use(Vuex);

const store = new Vuex.Store({
    strict: true,
    state: {
        status: '',
        loading: false,
        errors: null,
    },
    mutations: {
        SET_ERROR: (state, error) => state.error = error,
        SET_LOADING_STATUS: (state, payload) => state.loading = payload,
    },
    getters: {
        isLoading: state => state.loading,
        errors: state => state.errors
    },
    actions: {},
    modules: {
        user,
        checklists,
        reports,
    }
});

export default store
