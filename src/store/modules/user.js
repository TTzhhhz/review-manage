import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth.js'
import { login, getUserInfo, getUserDetailById } from '@/api/user.js'
import { resetRouter } from '@/router/index.js'
const state = {
  // 状态
  token: getToken(),// 设置token共享，在axios请求拦截器统一注入
  userInfo: {} // 不定义为null主要是为了包装getters，null没法读取
}
const mutations = {
  setToken(state, token) {
    // 修改vuex中存储的token
    state.token = token
    // 同步给cookie中存储的token
    setToken(token)
  },
  removeToken(state) {
    // 置空vuex中的token
    state.token = null
    // 移除缓存中的token
    removeToken()
    // vuex中的state也需要重置

  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  // 登陆actions
  async login(context, data) {
    // 请求获取token
    const res = await login(data)
    // 同步token到vuex和缓存
    context.commit('setToken', res)
    // 要存入当前的时间戳，注入token时判断token的时效性
    setTimeStamp()
  },
  // 登出actions
  lgout(context) {
    // 删除token，删除用户资料，跳转登陆页
    context.commit('removeToken')
    context.commit('removeUserInfo')
    // 路由表也需要清空
    resetRouter()
    context.commit('permission/setRoutes', [], { root: true })

  },
  // 获取用户资料
  async getUserInfo(context) {
    const result = await getUserInfo()
    // 这里已经获取到用户id，利用id获取用户基本信息
    const baseInfo = await getUserDetailById(result.userId)
    context.commit('setUserInfo', { ...result, ...baseInfo })
    return result // 这里是后面做权限时还需要用到
  }

}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
