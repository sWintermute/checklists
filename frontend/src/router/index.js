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

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Checklists,
      meta: { requiresAuth: true },
      props: (route) => ({ page: route.query.page })
    },
    {
      path: '/checklist/:id',
      component: Checklist,
      meta: { requiresAuth: true }
    },
    {
      path: '/reports',
      component: Reports,
      meta: { requiresAuth: true }
    },
    {
      path: '/report/:id',
      component: Report
    },
    {
      path: '/profile',
      component: Profile,
      meta: { requiresAuth: true }
    },
    {
      path: '/responses',
      component: FilledChecklists,
      meta: { requiresAuth: true },
      props: (route) => ({ page: route.query.page })
    },
    {
      path: '/response/:id',
      component: FilledChecklist,
      meta: { requiresAuth: true }
    },
    {
      path: '/map',
      name: 'map',
      component: () => import(/* webpackChunkName: "map" */ '@/views/ChecklistsMap.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/*', redirect: '/login'
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters['user/isLoggedIn']
  if (isLoggedIn) {
    if (to.path === '/login') {
      next('/')
    }
  }
  next()
})

export default router
