import HttpRequest from '@/libs/axios'
import config from '@/config'
import Vue from 'vue'
const publicPath = process.env.NODE_ENV === 'development' ? config.publicPath.dev : (process.env.NODE_ENV === 'production' ? config.publicPath.pro : config.publicPath.test)
Vue.prototype.$baseApi = publicPath
const axios = new HttpRequest(publicPath)
export default axios