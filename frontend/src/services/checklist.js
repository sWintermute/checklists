import Api from './api';
const resource = '/api/v1/lists/';

export default {
    getChecklists(params = {}) {
        return Api().get(`${resource}`, { params: params });
    },
};