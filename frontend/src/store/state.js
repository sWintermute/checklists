export default {
    status: '',
    loading: false,
    error: null,
    token: localStorage.getItem('token') || '',
    user: {},
    list: {},
    lists: [],
    filledLists: [],
    answers: [],
    reports: [],
    report: {}
};