import axios from 'axios';

export default {
    FETCH_REPORTS({commit, state}) {
        return new Promise((resolve, reject) => {
            commit('SET_LOADING_STATUS', true);
            axios({
                url: '/api/v1/reports/',
                method: 'GET'
            }).then(response => {
                commit('SET_LOADING_STATUS', false);
                const reports = response.data;
                localStorage.setItem('reports', reports);
                commit('SET_REPORTS', reports);
                resolve(response)
            }).catch(error => {
                console.log(error);
                reject(error)
            })
        })
    },
    FETCH_REPORT({commit, state},  report_id) {
        return new Promise((resolve, reject) => {
            commit('SET_LOADING_STATUS', true);
            axios({
                url: '/api/v1/report/' + report_id + '/',
                headers: {
                    Authorization: 'Token ' + state.token,
                },
                method: 'GET'
            }).then(response => {
                commit('SET_LOADING_STATUS', false);
                const report = response.data;
                localStorage.setItem('report', report);
                commit('SET_REPORT', report);
                resolve(response)
            }).catch(error => {
                console.log(error);
                reject(error)
            })
        })
    },
}
