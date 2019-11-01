export default {
    SET_USER(state, payload) {
        state.user = payload
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
}
