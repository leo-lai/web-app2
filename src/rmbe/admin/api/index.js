import config from '../config'
import createService from './axios'
import { storage, utils } from 'assets/js/utils'
import { Message } from 'element-ui'
import { mockFetch } from '../mock'
import router from '../router'

// 创建axios实例
const service = createService()

const fetch = {
  ajax(url = '', data = {}, method = 'GET', contentType = 'form') {
    return new Promise((resolve, reject) => {
      Object.keys(data).forEach(key => {
        if( data[key] === null || data[key] === undefined || data[key] === '') {
          delete data[key]
        }
      })
      service({
        url, method, data
      }).then(resolve).catch(error => {
        error && error.message && Message({
          type: 'error',
          message: error.message
        })
        reject(error)
      })
    })
  },
  get(url, data) {
    return this.ajax(url, data)
  },
  post(url, data) {
    return this.ajax(url, data, 'POST')
  }
}

const api = {
  baseURL: config.api.baseURL,
  auth: {
    check() {
      let userinfo = storage.local.get('userinfo')
      return (userinfo && userinfo.token && userinfo.id)
    },
    login(formData = {}) {
      storage.local.remove('logout')
      formData.type = 'password'
      return fetch.post('/login', formData)
    },
    logout(toLogin = true) {
      return new Promise((resolve, reject) => {
        if (false && this.check()) {
          fetch.post('/logout').then(resolve, reject)
        } else {
          resolve()
        }
      }).finally(() => {
        storage.local.remove('userinfo')
        storage.local.remove('usermenus')
        // toLogin && location.replace(`${config.router.base}/login?to=` + location.href)
        toLogin && router.replace('/login')
      })
    }
  },
  dashboard: {
    getCount() {
      return fetch.post('/dashboard/get').then(({data}) => {
        data.recharge_amount = data.recharge_amount ? (data.recharge_amount / 100).toFixed(2) : 0
        return data
      })
    },
    getMap() {
      return fetch.post('/dashboard/map').then(({data}) => {
        data.seller_recharge_amount = data.seller_recharge_amount ? (data.seller_recharge_amount / 100).toFixed(2) : 0
        return data
      })
    },
    getRecharge() {
      return fetch.post('/recharge/statistics/list').then(({data}) => {
        return data.map(item => {
          item.moneyStr = (item.money / 100).toFixed(2)
          return item
        })
      })
    }
  },
  sys: { // 系统管理
    getList(formData = {}, page = 1, row = 10) {
      formData.per_page = row
      formData.page_number = page - 1      
      return fetch.post('/role/list', formData)
    },
    add(formData = {}) {
      if(formData.uid || formData.user_id) {
        return fetch.post('/role/update', formData)  
      } 
      return fetch.post('/role/add', formData)
    },
    del(user_id = '') {
      return fetch.post('/role/delete', { user_id })
    },
    getPermission() {
      return fetch.post('/permission/list')
    }
  },
  business: { // 商户管理
    getList(formData = {}, page = 1, row = 10) {
      formData.per_page = row
      formData.page_number = page - 1      
      return fetch.post('/seller/list', formData)
    },
    getInfo(formData = {}) {
      return fetch.post('/seller/info', formData)
    },
    add(formData = {}) {
      if(formData.seller_id) {
        return fetch.post('/seller/update', formData)
      }
      return fetch.post('/seller/add', formData)
    }
  },
  device: { // 设备管理
    getList(formData = {}, page = 1, row = 10) {
      formData.per_page = row
      formData.page_number = page - 1      
      return fetch.post('/device/list', formData)
    },
    relate(formData = {}, related = true) { // 关联设备
      if(related) {
        return fetch.post('/device/relate', formData)  
      }else {
        return fetch.post('/device/un_relate', formData)
      }
    },
    add(count = '') {
      return fetch.post('/device/generate', { count })
    },
    del(number = '') {
      return fetch.post('/device/delete', { number })
    },
    getRemindList(formData = {}, page = 1, row = 10) { // 物料提醒列表
      formData.per_page = row
      formData.page_number = page - 1      
      return fetch.post('/device/alter_list', formData)
    },
    supply(number = '') { // 补货
      return fetch.post('/device/supply', { number })
    }
  },
  customer: { // 消费者管理
    getList(formData = {}, page = 1, row = 10) {
      formData.per_page = row
      formData.page_number = page - 1      
      return fetch.post('/customer/list', formData)
    },
    getOrderList(formData = {}, page = 1, row = 10) {
      formData.per_page = row
      formData.page_number = page - 1      
      return fetch.post('/customer/order/list', formData)
    }
  },
  recharge: { // 充值管理
    getPrice() {
      return fetch.post('/recharge/base/get').then(({data}) => {
        return (data && data.money) ? (data.money / 100).toFixed(2) : 0
      })
    },
    setPrice(money = 0) {
      money = money * 100
      return fetch.post('/recharge/base/create', { money })
    },
    getCouponList() {
      return fetch.post('/recharge/coupon/list')
    },
    addCoupon(formData = {}) {
      return fetch.post('/recharge/coupon/add', formData)
    },
    delCoupon(coupon_id = '') {
      return fetch.post('/recharge/coupon/delete', { coupon_id })
    },
    getTmplList() {
      return fetch.post('/recharge/template/list')
    },
    addTmpl(count = 0) {
      return fetch.post('/recharge/template/add', { count })
    },
    delTmpl(template_id = '') {
      return fetch.post('/recharge/template/delete', { template_id })
    }
  },
  finance: { // 财务管理
    getList(formData = {}, page = 1, row = 10) {
      formData.per_page = row
      formData.page_number = page - 1      
      return fetch.post('/order/statistics/list', formData)
    }
  }
}

export default api
