import { constantRoutes, asyncRoutes } from '@/router/index.js'
const state = {
  routes: [...constantRoutes] // 表示当前用户拥有的所有路由权限的数组
}
const mutations = {
  // 修改routes的方法
  setRoutes(state, newRoutes) {
    // newRoutes表示要添加的动态路由
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  // 筛选路由
  // 第二个属性为当前用户拥有的菜单权限
  filterRoutes(context, menus) {
    const allNewRoutes = []
    menus.forEach(key => {
      // asyncRoutes每项的name属性
      allNewRoutes.push(...asyncRoutes.filter(item => item.name === key))
    })
    context.commit('setRoutes', allNewRoutes)
    // 这里为什么还要return，上面state不已经改了吗，上面的state是为了左侧菜单，下面是改变路径
    return allNewRoutes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}