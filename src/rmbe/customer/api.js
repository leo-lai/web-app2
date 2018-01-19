import config from './config'
import axios from 'axios'
import { storage, utils } from 'assets/js/utils'
import store from './store'

const service = axios.create({
  baseURL: config.api.baseURL,
  timeout: 60000
})

// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  let userinfo = storage.local.get('customer_userinfo')
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  config.headers['token'] = userinfo && userinfo.token ? userinfo.token : ''
  config.headers['uid'] = userinfo && userinfo.id ? userinfo.id : ''
  config.transformRequest = [function(data) {
    let ret = []
    for (let key in data) {
      ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    }
    return ret.join('&')
  }]
  return config
}, error => {
  return Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(response => {
  let data = response.data
  switch(data.code) {
    case 200:
      return data
  }
  return Promise.reject({
    code: data.code,
    message: data.msg
  })
}, error => {
  let err = { code: '',  message: '' }
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        err.message = '请求错误'
        break
      case 401:
        store.dispatch('login')
        err.message = '登录状态失效，请重新登录'
        break
      case 403:
        err.message = '拒绝访问'
        break
      case 404:
        err.message = `请求地址出错: ${error.response.config.url}`
        break
      case 408:
        err.message = '请求超时'
        break
      case 500:
        err.message = '服务器内部错误'
        break
      case 501:
        err.message = '服务未实现'
        break
      case 502:
        err.message = '网关错误'
        break
      case 503:
        err.message = '服务不可用'
        break
      case 504:
        err.message = '网关超时'
        break
      case 505:
        err.message = 'HTTP版本不受支持'
        break
      default:
        err.message = '服务器连接失败'
    }
    err.code = error.response.status
    err.message = error.response.data ? error.response.data.msg : err.message
  }
  return Promise.reject(err)
})

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
        if(error && error.message && error.code !== 401) {
          window.f7.alert(error.message)
        }
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
  wxpay(payConfig) {
  	let promise = new Promise((resolve, reject) => {
      let onBridgeReady = function(){
        WeixinJSBridge.invoke('getBrandWCPayRequest', payConfig, res => {
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            resolve('ok')
          } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            reject('cancel')
          } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
            reject('fail')
          } else {
            reject('支付失败')
          }
        })
      }

      if (typeof WeixinJSBridge == 'undefined') {
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
      } else {
        onBridgeReady()
      }
    })

    return promise
  },
  auth: {
  	grant(url = location.href) {
  		window.location.replace(config.api.baseURL + '/wechat/login?scopes=base&url=' + url)
  	},
    pay(seller_id = '', params = {}) {
      let url = config.host + utils.url.getRootPath() + '/pay/'
      url = utils.url.setArgs(url, params)
      return fetch.post('/user/lcsw_auth', {
        seller_id, url
      })
    },
    check() {
      return new Promise((resolve, reject) => {
        let userinfo = storage.local.get('customer_userinfo')
        if(userinfo && userinfo.token && userinfo.id){
          resolve(userinfo)
        }else {
          reject('未授权，请登录')
        }
      })
    },
    login(formData = {}) {
      return new Promise((resolve, reject) => {
        formData.type = 'wechat'
      	fetch.post('/user/login', formData).then(({data}) => {
      		storage.local.set('customer_userinfo', data)
      		resolve(data)
      	}).catch(reject)
      })
    },
    logout(remote = false) {
      return new Promise((resolve, reject) => {
        if (remote && this.check()) {
          fetch.post('/user/logout').then(resolve, reject)
        } else {
          resolve()
        }
      })
    },
    getInfo() {
      return fetch.post('/user/info')
    }
  },

  order: {
    getList(formData = {}, page = 1, rows = 50) { // 消费记录
      formData.per_page = rows
      formData.page_number = page - 1      
      return fetch.post('/customer/order/list', formData).then(({data}) => {
        data.total = data.count
        data.page = page
        data.rows = rows
        return data
      })
    }
  },

  pay: {
    getDeviceInfo(number = '') {
      return fetch.post('/device/seller/info', { number })
    },
    getCouponList(formData = {}) {
      formData.page_number = 0
      formData.per_page = 100000
      return fetch.post('/customer/coupon/list', formData)
    },
    create(formData = {}) {
      return fetch.post('/customer/order/create', formData)
    }
  }
}

export default api