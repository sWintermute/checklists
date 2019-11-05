export default {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    userProfile: state => state.userProfile,
}
