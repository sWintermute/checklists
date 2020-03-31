import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import TokenService from './tokenService'
import config from './config'

const client = axios.create(config)

export default client
