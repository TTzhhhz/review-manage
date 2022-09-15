import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store/index.js'
import { getTimeStamp } from '@/utils/auth.js'
import router from '@/router/index.js'

const TimeOut = 3600
function checkTimeOut() {
  let currentTime = Date.now()
  let timestamp = getTimeStamp()
  return (currentTime - timestamp) / 1000 > TimeOut
}
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 请求拦截器,统一注入token
service.interceptors.request.use(config => {
  if (store.getters.token) {
    // 判断token是否失效
    if (checkTimeOut()) {
      // token失效
      store.dispatch('user/lgout')
      router.push('/login')
      return Promise.reject(new Error('token超时'))
    }
    // 注入token
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  // config为请求的配置信息，必须返回
  return config
}, error => {
  Message.error(error.Message) // 提示错误信息,不生效？
  return Promise.reject(error) // 进入catch阶段
})
// 响应拦截器，统一提取返回值data
service.interceptors.response.use(response => {
  // 请求成功，需要解构数据
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message)) // 进入catch阶段
  }
}, error => {
  // 请求失败提示错误，error中会有response对象，如果其中的code为code表示后台表示token超时
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 表示后端告诉我们超时
    store.dispatch('user/lgout')
    router.push('/login')
  } else {
    Message.error(error.Message) // 提示错误信息,不生效？
  }
  return Promise.reject(error) // 进入catch阶段
})
export default service
