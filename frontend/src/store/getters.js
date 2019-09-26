export default {
    isLoggedIn: state => !!state.token,
    isLoading: state => state.loading,
    authStatus: state => state.status,
    user: state => state.user,
    report: state => state.report,
    errors: state => state.error
}