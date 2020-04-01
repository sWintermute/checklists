export default {
  SET_USER (state, payload) {
    state.userProfile = payload
  },
  SET_AUTH_TOKEN (state, payload) {
    state.auth_token = payload
  },
  SET_LOGOUT (state) {
    state.status = ''
    state.auth_token = ''
    state.userProfile = {}
  }
}
