import Vue from 'vue'
// import wilddog from 'wilddog'
import Framework7 from 'framework7'
import Framework7Vue from 'framework7-vue'

import { storage, utils } from 'assets/js/utils'
import config from './config'

import store from './store'

import api from './api'
import app from './app'

// Framework7Vue
Vue.use(Framework7Vue)
// wilddog 监听版本更新
// wilddog.initializeApp(config.wilddog)

utils.url.getRootPath = function(){
	return utils.url.join(config.framework7.pushStateRoot, config.framework7.pushStateSeparator) 
}

// 事件控制中枢
const eventHub = new Vue()

Vue.mixin({
  created() {
  	this.$$config = config
    // 野狗
    // this.$$wilddog = wilddog
    // 小工具
    this.$$utils = utils
    // url操作
    this.$$url = utils.url
    // 本地缓存
    this.$$storage = storage
    // 接口
    this.$$api = api
    // 组件间事件通信
    this.$$event = eventHub
  }
})

new Vue({
	el: '#app',
  store,
	template: '<app/>',
	framework7: config.framework7,
  components: {
  	app
  }
})

