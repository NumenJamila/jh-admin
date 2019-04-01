import HttpRequest from '@/libs/axios'
import config from '@/config'
import Vue from 'vue'
// const publicPath = process.env.NODE_ENV === 'development' ? config.publicPath.dev : (process.env.NODE_ENV === 'production' ? config.publicPath.pro : config.publicPath.preview)
const publicPath = process.env.NODE_ENV === 'development' ? config.publicPath.dev : process.env.VUE_APP_TITLE === 'preview' ? config.publicPath.preview : config.publicPath.pro;
Vue.prototype.$baseApi = publicPath
const axios = new HttpRequest(publicPath)
export default axios