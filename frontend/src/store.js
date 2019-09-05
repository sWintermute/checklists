import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import store from "@vue/cli-service/generator/vuex/template/src/store";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		status: '',
		token: localStorage.getItem('token') || '',
		user: {},
		list: {},
		lists: [],
		reports: []
	},
    getters : {
        GET_LISTS: state => state.lists,
        GET_LIST_BY_ID: (state) => id => {
            return state.lists.find(user => user.id === id);
        },
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status,
    },
	mutations: {
		SET_USER(state,payload) {
			state.user = payload
		},
		SET_LIST(state, payload) {
			state.list = payload
		},
        SET_LIST_QUESTIONS(state, payload) {
            state.list.questions = payload
        },
		SET_LISTS(state, payload) {
			state.lists = payload
		},
		SET_REPORTS(state, payload) {
			state.reports = payload
		},
		SET_AUTH_REQUEST(state) {
			state.status = 'loading'
		},
		SET_AUTH_SUCCESS(state, token, user) {
			state.status = 'success';
			state.token = token;
			state.user = user
		},
		SET_AUTH_ERROR(state) {
			state.status = 'error'
		},
		SET_LOGOUT(state) {
			state.status = '';
			state.token = ''
		},
	},
	actions: {
		profile({commit, state}) {
			return new Promise((resolve, reject) => {
				axios({
					url: '/api/v1/me/',
					headers: {
						Authorization: 'Token ' + state.token,
					},
					method: 'GET'
				}).then(response => {
					const user = response.data[0];
					localStorage.setItem('user', user);
					commit('SET_USER', user);
					resolve(response)
				}).catch(error => {
					console.log(error);
					reject(error)
				})
			})
		},
        change_list({commit, state}, list_id, answers){
            return new Promise((resolve, reject) => {
                state.list.answers = [];
                state.list.interview_uuid = [];
                state.list.survey = [];

                axios({
                    url: '/api/v1/response/',
                    headers: {
                        Authorization: 'Token ' + state.token,
                    },
                    method: 'POST'
                }).then(response => {
                    const list = response.data;
                    localStorage.setItem('list', list);
                    commit('SET_LIST', list);
                    resolve(response)
                }).catch(error => {
                    console.log(error);
                    reject(error)
                })
            })
        },
		list({commit, state}, list_id) {
			return new Promise((resolve, reject) => {
				axios({
					url: '/api/v1/lists/' + list_id + '/',
					headers: {
						Authorization: 'Token ' + state.token,
					},
					method: 'GET'
				}).then(response => {
					const list = response.data;
					localStorage.setItem('list', list);
					commit('SET_LIST', list);
					resolve(response)
				}).catch(error => {
					console.log(error);
					reject(error)
				})
			})
		},
		lists({commit, state}) {
			return new Promise((resolve, reject) => {
				axios({
					url: '/api/v1/lists/',
					headers: {
						Authorization: 'Token ' + state.token,
					},
					method: 'GET'
				}).then(response => {
					const lists = response.data;
					localStorage.setItem('lists', lists);
					commit('SET_LISTS', lists);
					resolve(response)
				}).catch(error => {
					console.log(error);
					reject(error)
				})
			})
		},
		reports({commit, state}) {
			return new Promise((resolve, reject) => {
				axios({
					url: '/api/v1/reports/',
					headers: {
						Authorization: 'Token ' + state.token,
					},
					method: 'GET'
				}).then(response => {
					const reports = response.data;
					localStorage.setItem('lists', reports);
					commit('SET_REPORTS', reports);
					resolve(response)
				}).catch(error => {
					console.log(error);
					reject(error)
				})
			})
		},
		login({commit}, user){
			return new Promise((resolve, reject) => {
				commit('SET_AUTH_REQUEST');
				axios({url: '/auth/token/login', data: user, method: 'POST' })
				.then(resp => {
					const token = resp.data.auth_token;
					const user = resp.data.user;
					localStorage.setItem('token', token);
					axios.defaults.headers.common['Authorization'] = token;
					commit('SET_AUTH_SUCCESS', token, user);
					console.log(user);
					resolve(resp)
				})
				.catch(err => {
					commit('SET_AUTH_ERROR');
					localStorage.removeItem('token');
					reject(err)
				})
			})
		},
		logout({commit}){
			return new Promise((resolve, reject) => {
				commit('SET_LOGOUT');
				// POST REQUEST
				localStorage.removeItem('token');
				delete axios.defaults.headers.common['Authorization'];
				resolve()
			})
		}
	}
})
