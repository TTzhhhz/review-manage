import Layout from '@/layout'

export default {
  path: '/permission',
  name: 'permissions', // 后续做权限管理
  component: Layout,
  children: [{
    path: '',
    name: 'permissions',
    component: () => import('@/views/permission'),
    meta: {
      title: '权限管理', // 用于渲染左侧导航栏
      icon: 'lock'

    }
  }]
}