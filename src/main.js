// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import {
  directive as clickOutside
} from 'v-click-outside-x'
import installPlugin from '@/plugin'
import './index.less'
import '@/assets/icons/iconfont.css'
import TreeTable from 'tree-table-vue'
import VOrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'

// 实际打包时应该不引入mock，用测试环境测试时也需注释mock
/* eslint-disable */
if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(TreeTable)
Vue.use(VOrgTree)
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
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
const excludePage = ['login', 'error_500', 'error_404']

// 记录来源页面路由，无权限时关闭
window.vueReferer = '';
router.beforeEach((to, from, next) => {
  if (from) {
    vueReferer = from.name
  }
  if ($.inArray(to.name, excludePage) < 0) {
    toGetSetMenu(to, from, next)
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
      var userInfo = {
        user: res.data.userInfo,
        menuList: res.data.menuList,
        oprKeyList: res.data.codeList
      }
      store.dispatch('setUserInfo', userInfo)
      next()
    }
  }).catch(res => {
    next({
      name: "error_500" // 跳转到500
    })
  })
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
