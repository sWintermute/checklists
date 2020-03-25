import Vue from 'vue'
import store from '@/store'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
const Checklists = () => import(/* webpackChunkName: "checklists" */ '@/views/Checklists.vue')
const Checklist = () => import(/* webpackChunkName: "checklist" */ '@/views/Checklist.vue')
const Reports = () => import(/* webpackChunkName: "reports" */ '@/views/Reports.vue')
const Report = () => import(/* webpackChunkName: "report" */ '@/views/Report.vue')
const Profile = () => import(/* webpackChunkName: "profile" */ '@/views/Profile.vue')
const FilledChecklists = () => import(/* webpackChunkName: "responses" */ '@/views/FilledChecklists.vue')
const FilledChecklist = () => import(/* webpackChunkName: "response" */ '@/views/FilledChecklist.vue')

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isLoggedIn) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isLoggedIn) {
    next()
    return
  }
  next('/login')
}

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/login',
      component: Login,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/',
      component: Checklists,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/checklist/:id',
      component: Checklist,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/reports',
      component: Reports,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/report/:id',
      component: Report
    },
    {
      path: '/profile',
      component: Profile,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/responses',
      component: FilledChecklists,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/response/:id',
      component: FilledChecklist,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/map',
      name: 'map',
      component: () => import(/* webpackChunkName: "map" */ '@/views/ChecklistsMap.vue'),
      beforeEnter: ifAuthenticated
    },
    {
      path: '/*', redirect: '/login',
    },
  ]
})

export default router
