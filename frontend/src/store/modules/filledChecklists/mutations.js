export default {
    SET_FILLED_LIST(state, payload) {
        state.filledList = payload
    },
    SET_FILLED_LISTS(state, payload) {
        state.filledLists = payload
    },
    SET_ADDRESS(state, payload) {
        state.address.push(payload)
    },
}
