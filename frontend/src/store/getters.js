export default {
    isLoggedIn: state => !!state.token,
    isLoading: state => state.loading,
    authStatus: state => state.status,
    errors: state => state.error
}