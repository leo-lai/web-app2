import 'babel-polyfill'
import config from './config'
import { storage, utils } from 'assets/js/utils'

import Vue from 'vue'

// element-ui
import ElementUI from 'element-ui'
Vue.use(ElementUI)

import store from './store'
import router from './router'
import api from './api'

import app from './app'

// 高德地图
import VueAMap from 'vue-amap'
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: '976fe9a654ec6d6127bdb1eb1db56c3e',
  plugin: ['Scale', 'Geocoder']
})

// quill-editor
import VueQuillEditor, { Quill } from 'vue-quill-editor'
import 'components/quill-image-resize-module'
import ImageDrop from 'components/quill-image-drop-module'
import ImageUpload from 'components/quill-image-upload-module'

config.editorOption.modules.imageUpload = {
  onChange(base64Content) {
    return api.uploadByBase64(base64Content).then(({ data }) => {
      return data
    })
  }
}
Vue.use(VueQuillEditor, config.editorOption)

// Quill.register('modules/imageResize', ImageResize)
Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/imageUpload', ImageUpload)

// 事件控制中枢
const eventHub = new Vue()

// 添加一些组件对象
Vue.mixin({
  created() {
    this.$$config = config
    // 小工具
    this.$$utils = utils
    // url操作
    this.$$url = utils.url
    this.$$href = function (url, action = 'push') {
      if (!url) return

      if (/^http(s?)/i.test(url)) {
        window.location[action === 'push' ? 'assign' : action](url)
      } else {
        router[action] && router[action](url)
      }
    }
    // 本地缓存
    this.$$storage = storage
    // 接口对象
    this.$$api = api
    // 组件间事件通信
    this.$$event = eventHub
  }
})

new Vue({
  router,
  store,
  render: h => h(app)
}).$mount('#app')
