import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import components from '@/components'
import * as directives from '@/directives/index.js'
import * as filters from '@/filters/index.js'
import minins from '@/mixin/checkPermission.js'
import i18n from '@/lang/index.js'


// 统一注册全局自定义指令
Object.keys(directives).forEach(key => {
  // key是字符串的形式，不太好用directives.key 显示未定义
  Vue.directive(key, directives[key])
})
// 统一注册过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// 统一注册全局组件
Vue.use(components)

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

// 全局混入检查对象
Vue.mixin(minins)

import '@/icons' // icon
import '@/permission' // permission control
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)


Vue.config.productionTip = false


new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
