import Vue from 'vue'
import Router from 'vue-router'

import Login from './views/Login.vue'
import PageNotFound from '@/views/PageNotFound.vue'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'checklists',
      component: () => import(/* webpackChunkName: "checklists" */ './views/Checklists.vue'),
      meta: {
        requiresAuth: true
      },
      children: []
    },
    {
      path: '/checklist/:id',
      name: 'checklist',
      component: () => import(/* webpackChunkName: "checklist" */ './views/Checklist.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import(/* webpackChunkName: "reports" */ './views/Reports.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/report/:id',
      name: 'report',
      component: () => import(/* webpackChunkName: "report" */ './views/Report.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import(/* webpackChunkName: "profile" */ './views/Profile.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/responses',
      name: 'responses',
      component: () => import(/* webpackChunkName: "responses" */ './views/FilledChecklists.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/response/:id',
      name: 'response',
      component: () => import(/* webpackChunkName: "response" */ './views/FilledChecklist.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '*',
      component: () => import(/* webpackChunkName: "page-not-found" */ './views/PageNotFound.vue'),
      component: PageNotFound,
    },
  ]
})

export default router
