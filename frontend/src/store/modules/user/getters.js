export default {
  isLoggedIn: state => !!state.auth_token,
  authStatus: state => state.status,
  userProfile: state => state.userProfile
}
