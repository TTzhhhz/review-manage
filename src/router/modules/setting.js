import Layout from '@/layout'

export default {
  path: '/setting',
  name: 'settings', // 后续做权限管理
  component: Layout,
  children: [{
    path: '',
    name: 'setting',
    component: () => import('@/views/setting'),
    meta: {
      title: '设置', // 用于渲染左侧导航栏
      icon: 'setting'
    }
  }]
}