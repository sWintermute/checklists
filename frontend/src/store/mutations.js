import Vue from 'vue';

export default {
    SET_LOADING_STATUS(state, payload) {
        state.loading = payload
    },
    SET_USER(state, payload) {
        state.user = payload
    },
    SET_ANSWERS(state, payload) {
        state.answers = payload
    },
    SET_LIST(state, payload) {
        state.list = payload
    },
    SET_LIST_QUESTIONS(state, payload) {
        state.list.questions = payload
    },
    SET_LISTS(state, payload) {
        state.lists = payload
    },
    SET_FILLED_LISTS(state, payload) {
        state.lists = payload
    },
    SET_REPORTS(state, payload) {
        state.reports = payload
    },
    SET_REPORT(state, payload) {
        state.report = payload
    },
    SET_AUTH_REQUEST(state) {
        state.status = 'loading'
    },
    SET_AUTH_SUCCESS(state, token, user) {
        state.status = 'success';
        state.token = token;
        state.user = user
    },
    SET_AUTH_ERROR(state) {
        state.status = 'error'
    },
    SET_LOGOUT(state) {
        state.status = '';
        state.token = ''
    },
    SET_ERROR: (state, error) => state.error = error,
}