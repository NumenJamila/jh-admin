// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import config from '@/config'
import importDirective from '@/directive'
import Distpicker from 'v-distpicker'
import {
  directive as clickOutside
} from 'v-click-outside-x'

import './index.less'
import '@/assets/icons/iconfont.css'

// 实际打包时应该不引入mock
/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') require('@/mock')
console.log(process.env.NODE_ENV, process.env.VUE_APP_TITLE)

Vue.use(iView)
 
Vue.component('v-distpicker', Distpicker)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)
Vue.directive('clickOutside', clickOutside)

import axios from '@/libs/api.request'
import $ from 'jquery'
//不需要校验登录的的页面
const excludePage = ['login', 'error_500', 'error_404','numen']

// 记录来源页面路由，无权限时关闭
window.vueReferer = '';
router.beforeEach((to, from, next) => {
  if (from) {
    vueReferer = from.name
  }
  if ($.inArray(to.name, excludePage) < 0) {
    if(!store.getters.getIsSkip) {
      toGetSetMenu(to, from, next)
    } else {
      next()
    }
  } else {
    next()
  }
})

function toGetSetMenu(to, from, next) {
  iView.LoadingBar.start()
  axios.request({
    url: '/auth/setMenu',
    method: 'post'
  }).then(res => {
    if (!res.data.isSuccess) {
      // 未登录且要跳转的页面不是登录页
      next({
        name: "login" // 跳转到登录页
      })
    } else {
      store.dispatch('setIsSkip',true)
      var userInfo = {
        user: res.data.userInfo,
        menuList: res.data.menuList,
        oprKeyList: res.data.codeList
      }
      store.dispatch('setUserInfo', userInfo)
      next()
    }
  }).catch(err => {
    console.log(err)
    next({
      name: "error_500" // 跳转到500
    })
  })
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
