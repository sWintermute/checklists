export default {
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
    SET_ENTRIES(state, payload) {
        state.entries = payload
    },
}
