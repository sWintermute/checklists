export default {
    SET_USER(state, payload) {
        state.userProfile = payload
    },
    SET_AUTH_REQUEST(state) {
        state.status = 'loading'
    },
    SET_AUTH_SUCCESS(state, userProfile) {
        state.status = 'success';
        state.userProfile = userProfile
    },
    SET_AUTH_ERROR(state) {
        state.status = 'error'
    },
    SET_LOGOUT(state) {
        state.status = '';
        state.userProfile = {}
    },
}
