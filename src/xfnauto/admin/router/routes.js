import layout from '../layout/default'

const routes = [
  {
    path: '/',
    component: layout,
    meta: { hidden: true },
    children: [
      {
        path: '',
        meta: { title: '首页' },
        component: resolve => require(['../pages/index'], resolve)
      }
    ]
  },
  {
    path: '/base',
    component: layout,
    meta: { hidden: true },
    children: [
      {
        path: 'setting',
        meta: { title: '基本设置' },
        component: resolve => require(['../pages/base-setting'], resolve)
      },
      {
        path: 'data',
        meta: { title: '资料设置' },
        component: resolve => require(['../pages/base-data'], resolve)
      }
    ]
  },
  {
    path: '/stock',
    component: layout,
    meta: { hidden: true },
    children: [
      {
        path: '',
        meta: { title: '库存管理' },
        component: resolve => require(['../pages/stock'], resolve)
      }
    ]
  },
  {
    path: '/customer',
    component: layout,
    meta: { hidden: true },
    children: [
      {
        path: '',
        meta: { title: '客户体系' },
        component: resolve => require(['../pages/customer'], resolve)
      }
    ]
  },
  {
    path: '/bank',
    component: layout,
    meta: { hidden: true },
    children: [
      {
        path: '',
        meta: { title: '客户体系' },
        component: resolve => require(['../pages/bank'], resolve)
      }
    ]
  },
  {
    path: '/login',
    meta: { title: '登录', hidden: true },
    component: resolve => require(['../pages/login'], resolve)
  },
  {
    path: '/404',
    meta: { title: '找不到页面', hidden: true },
    component: resolve => require(['../pages/404'], resolve)
  },
  { path: '/admin', redirect: '/', hidden: true },
  { path: '/index.html', redirect: '/', hidden: true },
  { path: '*', redirect: '/404', hidden: true }
]

export default routes