const routes = [
  {
    title: '首页',
    path: '/'
  },
  {
    title: '支付',
    path: '/pay/',
    component: require('./pages/pay')
  },
  {
    title: '钱包',
    path: '/wallet/',
    component: require('./pages/wallet')
  },
  {
    title: '钱包充值',
    path: '/wallet/recharge/',
    component: require('./pages/wallet-recharge')
  },
  {
    title: '充值记录',
    path: '/wallet/record/',
    component: require('./pages/wallet-record')
  },
  {
    title: '设备列表',
    path: '/device/list/',
    component: require('./pages/device-list')
  },
  {
    title: '提醒列表',
    path: '/remind/list/',
    component: require('./pages/remind-list')
  },
  {
    title: '订单列表',
    path: '/order/list/',
    component: require('./pages/order-list')
  },
  {
    title: '优惠券',
    path: '/coupon/',
    component: require('./pages/coupon')
  },
  {
    title: '满减券',
    path: '/coupon/fullcut/',
    component: require('./pages/coupon-fullcut')
  },
  {
    title: '次数券',
    path: '/coupon/times/',
    component: require('./pages/coupon-times')
  },
  {
    title: '发放券',
    path: '/coupon/send/',
    component: require('./pages/coupon-send')
  },
  {
    title: '发放记录',
    path: '/coupon/record/',
    component: require('./pages/coupon-record')
  }
]

export default routes