import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)

// 将所有的svg文件引入到项目
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
