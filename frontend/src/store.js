import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex);

export default new Vuex.Store({
	strict:true,
	state: {
		status: '',
		token: localStorage.getItem('token') || '',
		user : {},
		lists: []
	},
	mutations: {
		SET_LISTS(state, payload) {
			state.lists = payload
		},
		auth_request(state) {
			state.status = 'loading'
		},
		auth_success(state, token, user) {
			state.status = 'success';
			state.token = token;
			state.user = user
		},
		auth_error(state) {
			state.status = 'error'
		},
		logout(state) {
			state.status = '';
			state.token = ''
		},
	},
	actions: {
		lists({commit}) {
			return new Promise((resolve, reject) => {
				axios({
					url: 'http://localhost/api/v1/lists/',
					headers: {
						Authorization: 'Token b15f978bfb506ac42623c96b9f39f60cc755e2da',
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
		login({commit}, user){
			return new Promise((resolve, reject) => {
				commit('auth_request');
				axios({url: 'http://localhost/auth/token/login', data: user, method: 'POST' })
				.then(resp => {
					const token = resp.data.token;
					const user = resp.data.user;
					localStorage.setItem('token', token);
					axios.defaults.headers.common['Authorization'] = token;
					commit('auth_success', token, user);
					resolve(resp)
				})
				.catch(err => {
					commit('auth_error');
					localStorage.removeItem('token');
					reject(err)
				})
			})
		},
		register({commit}, user){
			return new Promise((resolve, reject) => {
				commit('auth_request');
				axios({url: 'http://localhost:3000/register', data: user, method: 'POST' })
				.then(resp => {
					const token = resp.data.token;
					const user = resp.data.user;
					localStorage.setItem('token', token);
					// Add the following line:
					axios.defaults.headers.common['Authorization'] = token;
					commit('auth_success', token, user);
					resolve(resp)
				})
				.catch(err => {
					commit('auth_error', err);
					localStorage.removeItem('token');
					reject(err)
				})
			})
		},
		logout({commit}){
			return new Promise((resolve, reject) => {
					commit('logout');
					localStorage.removeItem('token');
					delete axios.defaults.headers.common['Authorization'];
					resolve()
			})
		}
	},
	getters : {
		lists: state => {
			return state.lists
		},
	  isLoggedIn: state => !!state.token,
	  authStatus: state => state.status,
	}
})
