import vueRouter from '@/router/index.js'
import store from '@/store/index.js'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

const whiteList = ['/login', '/404']

vueRouter.beforeEach(async (to, from, next) => {
  // 开启进度条
  nprogress.start()
  // 是否有token，有且目标页面是登陆页则跳转到主页，有但目标页面不是登陆页直接放行
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      if (!store.getters.userId) {
        // 获取用户资料
        const result = await store.dispatch('user/getUserInfo')
        // 根据用户标识改变路由对象,筛选得到当前用户可用的动态路由
        const allNewRoutes = await store.dispatch('permission/filterRoutes', result.roles.menus)
        vueRouter.addRoutes([...allNewRoutes, { path: '*', redirect: '/404', hidden: true },])
        // 使用addRoutes方法后固定写一次next(to.path)
        next(to.path)
      } else {
        next()
      }
    }
  } else {
    // 无且目标页面处于白名单内放行，不在白名单跳到登陆页
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
  nprogress.done() // 解决手动切换地址进度条不关闭
})

vueRouter.afterEach(() => {
  // 关闭进度条，我觉得这里不用写
  // nprogress.done()
})
