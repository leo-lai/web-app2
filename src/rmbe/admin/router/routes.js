import layout from '../layout/default'

let routes = [
  {
    path: '/login',
    meta: { title: '登录', hidden: true },
    component: resolve => require(['../pages/login'], resolve),
  },
  {
    path: '/404',
    meta: { title: '找不到页面', hidden: true },
    component: resolve => require(['../pages/404'], resolve),
  }
]

export let userMenus = [
  {
    path: '/',
    component: layout,
    meta: { title: '仪表盘' },
    children: [
      { 
        path: '', 
        meta: { title: '仪表盘' },
        component: resolve => require(['../pages/index'], resolve),
      }
    ], 
  },
  {
    path: '/sys',
    component: layout,
    meta: { title: '系统管理' },
    children: [
      { 
        path: '', 
        meta: { title: '' },
        component: resolve => require(['../pages/sys'], resolve),
      }
    ],
  },
  {
    path: '/device',
    component: layout,
    meta: { title: '设备管理' },
    children: [
      { 
        path: '', 
        meta: { title: '' },
        component: resolve => require(['../pages/device'], resolve),
      }
    ],
  },
  {
    path: '/business',
    component: layout,
    meta: { title: '商户管理' },
    children: [
      { 
        path: '', 
        meta: { title: '' },
        component: resolve => require(['../pages/business'], resolve),
      }
    ],
  },
  {
    path: '/customer',
    component: layout,
    meta: { title: '消费者管理' },
    children: [
      { 
        path: '', 
        meta: { title: '' },
        component: resolve => require(['../pages/customer'], resolve),
      }
    ],
  },
  {
    path: '/customer/order',
    component: layout,
    meta: { title: '消费者订单' },
    children: [
      { 
        path: '', 
        meta: { title: '' },
        component: resolve => require(['../pages/customer-order'], resolve),
      }
    ],
  },
  {
    path: '/materiel',
    component: layout,
    meta: { title: '物料提醒' },
    children: [
      { 
        path: '', 
        meta: { title: '' },
        component: resolve => require(['../pages/materiel'], resolve),
      }
    ],
  },
  {
    path: '/finance',
    component: layout,
    meta: { title: '财务管理' },
    children: [
      { 
        path: '', 
        meta: { title: '' },
        component: resolve => require(['../pages/finance'], resolve),
      }
    ],
  },
  {
    path: '/recharge',
    component: layout,
    meta: { title: '充值设置' },
    children: [
      { 
        path: '', 
        meta: { title: '' },
        component: resolve => require(['../pages/recharge'], resolve),
      }
    ],
  },
  {
    path: '/datamap',
    component: layout,
    meta: { title: '地图' },
    children: [
      { 
        path: '', 
        meta: { title: '' },
        component: resolve => require(['../pages/datamap'], resolve),
      }
    ],
  },
  { path: '*', redirect: '/404', hidden: true }
]

routes = routes.concat(userMenus)
export default routes