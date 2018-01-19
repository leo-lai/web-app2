import config from '../config'
import store from '../store'
import routes from './routes'

import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'

Vue.use(Router)

const router = new Router({
  routes,
  base: config.router.base,
	mode: 'history',
	scrollBehavior (to, from, savedPosition = { x:0, y:0 }) {
    return savedPosition
  }
})

// 路由控制
router.beforeEach((to, from, next) => {
  NProgress.start()
  store.dispatch('checkLogin').then(_ => {
  	if(to.path === '/login') {
      // next({path: '/'})
      next()
    }else {
      if(!store.getters.userMenus){
        store.dispatch('getUserMenus')
        next(to)
      } else {
        next()
      }
    }
  }).catch(_ => {
  	if(to.path === '/login') {
  		next()
  	}else {
  		store.dispatch('logout').finally(_ => {
	      next(false)
	    })
  	}
  }).finally(_ => {
  	NProgress.done()
  })
})
router.afterEach((to, from) => {
  NProgress.done()
})

export default router