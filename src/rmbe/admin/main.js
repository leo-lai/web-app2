import 'babel-polyfill'
import config from './config'
import { storage, utils } from 'assets/js/utils'

import Vue from 'vue'
import NProgress from 'nprogress'

import VueAMap from 'vue-amap'

import router from './router'
import store from './store'
import api from './api'

import app from './app'

// element-ui
import ElementUI from 'element-ui'
Vue.use(ElementUI)

// 高德地图
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: '976fe9a654ec6d6127bdb1eb1db56c3e',
  plugin: ['Scale', 'Geocoder']
})

// 本地模拟请求
// import Mock from './mock'
// Mock.bootstrap()

Vue.mixin({
  created () {
    this.$$config = config
    // 小工具
    this.$$utils = utils
    // url操作
    this.$$url = utils.url
    this.$$href = function (url, action = 'push') {
      if(!url) return

      if(/^http(s?)/i.test(url)) {
        window.location[action === 'push' ? 'assign' : action](url)
      } else {
        router[action] && router[action](url)
      }
    }
    // 本地缓存
    this.$$storage = storage
    // 接口对象
    this.$$api = api
  }
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  if(api.auth.check()) {
    next()
    // if(to.path === '/login') {
    //   next({path: '/'})
    // }else {
    //   if(!store.getters.userMenus || store.getters.userMenus.length === 0){
    //     store.dispatch('getUserMenus')
    //     next(to)
    //   } else {
    //     next()  
    //   }
    // }
  } else if (to.path !== '/login') {
    store.dispatch('logout').finally(_ => {
      NProgress.done()
      next(false)
    })
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  NProgress.done()
})

router.onReady(() => {
  // store.dispatch('autoLogin')
})

new Vue({
	router,
  store,
  render: h => h(app)
}).$mount('#app')

