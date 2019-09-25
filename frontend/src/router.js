import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Login from './components/Login.vue'
import Checklists from './components/Checklists.vue'
import Checklist from './views/Checklist.vue'
import Report from './views/Report.vue'
import Reports from './components/Reports.vue'
import Profile from './components/Profile.vue'

Vue.use(Router);

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'checklists',
      component: Checklists,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/reports',
      name: 'reports',
      component: Reports,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/checklist/:id',
      name: 'checklist',
      component: Checklist,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/report/:id',
      name: 'report',
      component: Report,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: {
        requiresAuth: true
      }
    },
  ]
});

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next();
      return
    }
    next('/login')
  } else {
    next()
  }
});

export default router
