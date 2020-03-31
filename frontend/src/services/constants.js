import Vue from 'vue'
import injector from 'vue-inject'
import axios from '@/plugins/axios'
 
injector.constant('$axios', axios)

export const $axios = injector.get('$axios')
