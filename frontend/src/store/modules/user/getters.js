export default {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    user: state => state.user,
}
