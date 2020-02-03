export default {
  SET_USER (state, payload) {
    state.userProfile = payload
  },
  SET_AUTH_TOKEN (state, payload) {
    state.auth_token = payload
  },
  SET_AUTH_REQUEST (state) {
    state.status = 'loading'
  },
  SET_AUTH_SUCCESS (state) {
    state.status = 'success'
  },
  SET_AUTH_ERROR (state) {
    state.status = 'error'
  },
  SET_LOGOUT (state) {
    state.status = ''
    state.auth_token = ''
    state.userProfile = {}
  }
}
