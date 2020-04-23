import axios from 'axios';
import config from '@/api/client/config';
import { getAuthToken } from '@/services/tokenService';

const $axios = axios.create(config);

const authInterceptor = (config: any) => {
    config.headers['Authorization'] = getAuthToken();
    return config;
}

$axios.interceptors.request.use(authInterceptor);

export default $axios;