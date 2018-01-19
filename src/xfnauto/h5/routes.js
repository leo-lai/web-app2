const routes = [
  {
    title: '淘车快',
    path: '/'
  },
  {
    title: '车小秘',
    path: '/car/men',
    component: require('./pages/car-men').default
  },
  {
    title: '关于淘车快',
    path: '/about',
    component: require('./pages/about').default
  }
]

export default routes