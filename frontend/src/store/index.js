import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user'
import checklists from './modules/checklists'
import filledChecklists from './modules/filledChecklists'
import reports from './modules/reports'

Vue.use(Vuex);

const store = new Vuex.Store({
    strict: true,
    state: {
        status: '',
        loading: false,
        error: {
            data: {
                snackbar: false,
                details: ""
            }
        },
    },
    getters: {
        error: state => state.error,
        isLoading: state => state.loading,
    },
    mutations: {
        SET_ERROR(state, payload) {
            state.error = payload;
        },
        SET_LOADING_STATUS: (state, payload) => state.loading = payload,
    },
    actions: {},
    modules: {
        user,
        checklists,
        filledChecklists,
        reports,
    }
});

export default store
