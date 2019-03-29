import axios from 'axios'
import store from '@/store'
import router from '../router'
// import { Spin } from 'iview'
const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor (publicPath = baseURL) {
    this.publicPath = publicPath
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.publicPath,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
      store.dispatch('setLoading', false)
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // console.log("请求拦截")
      // console.log(config)
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
        store.dispatch('setLoading', true)
      }
      this.queue[url] = true
      return config
    }, error => {
      console.log("请求出错")
      console.log(error)
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      console.log("响应拦截")
      console.log(res)
      this.destroy(url)
      if(res.data.code === 1007) {
        router.replace({ name: 'login' })
      }
      if(res.data.code === 401) {
        router.replace({ name: 'error_401' })
      }
      const { data, status } = res
      return { data, status }
    }, error => {
      console.log("响应出错")
      console.log(error)
      this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      addErrorLog(errorInfo)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
