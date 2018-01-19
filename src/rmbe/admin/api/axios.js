import config from '../config'
import axios from 'axios'
import { Message } from 'element-ui'
import { storage, utils } from 'assets/js/utils'
import api from './index'

export default function createService() {
  const service = axios.create({
    baseURL: config.api.baseURL,
    timeout: 60000
  })

  // request拦截器
  service.interceptors.request.use(config => {
    // Do something before request is sent
    let userinfo = storage.local.get('userinfo')
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
          if(!storage.local.get('logout')) {
            storage.local.set('logout', 1)
            Message({
              type: 'error',
              message: err.message || '登录状态失效，请重新登录',
              onClose(instance) {
                
              }
            })
            api.auth.logout()
          }
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

  return service
}
