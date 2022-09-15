import Layout from '@/layout'

export default {
  path: '/departments',
  name: 'departments', // 后续做权限管理
  component: Layout,
  children: [{
    path: '',
    name: 'departments',
    component: () => import('@/views/departments'),
    meta: {
      title: '组织架构', // 用于渲染左侧导航栏
      icon: 'tree'
    }
  }]
}