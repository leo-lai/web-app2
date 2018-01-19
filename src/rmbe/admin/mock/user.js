import Mock from 'mockjs'

export let _list = []

for (let i = 0; i < 35; i++) {
  _list.push(Mock.mock({
    id: Mock.Random.increment(),
    name: Mock.Random.cname(),
    username: Mock.Random.name(),
    password: Mock.Random.first(),
    region: Mock.mock('@county(true)'),
    // region: Mock.Random.region(),
    power: Mock.Random.pick(['设备管理', '财务管理']),
  }))
}

let _apis = {
  '/user/list': config => {
    let { per_page, page_number } = config.params

    per_page = Number(per_page)
    page_number = Number(page_number)

    let total = _list.length
    let returnList = []
    // 列表筛选
    returnList = _list.filter(user => { 
      return true
    })
    // 分页
    returnList = returnList.filter((user, index) => {
      return index < per_page * (page_number + 1) && index >= per_page * page_number
    })

    return {
      count: total,
      per_page,
      page_number,
      list: returnList
    }
  },
  '/user/add': config => {
    
  }
}

export default _apis
