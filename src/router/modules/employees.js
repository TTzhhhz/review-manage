import Layout from '@/layout'

export default {
  path: '/employees',
  name: 'employees', // 后续做权限管理
  component: Layout,
  children: [{
    path: '',
    name: 'employees',
    component: () => import('@/views/employees'),
    meta: {
      title: '员工管理', // 用于渲染左侧导航栏
      icon: 'people'
    }
  }, {
    path: 'detail/:id?',//问号表示有无id均可访问
    component: () => import('@/views/employees/detail.vue'),
    hidden: true,
    meta: {
      title: '员工详情'
    }
  }, {
    path: 'print/:id?',
    component: () => import('@/views/employees/print.vue'),
    hidden: true,
    meta: {
      title: '员工打印'
    }
  }]
}