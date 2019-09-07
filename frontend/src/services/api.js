import App from '../App.vue'
import store from '../store'
import axios from 'axios'

class Api {
    constructor() {
        this.baseUrl = '';
        axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    }

    call(requestType, url, data = null, headers = [], r = false) {
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
    }
}

export default Api;