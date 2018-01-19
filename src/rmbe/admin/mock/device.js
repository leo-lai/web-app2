import Mock from 'mockjs'

export let _list = []

for (let i = 0; i < 10; i++) {
  _list.push(Mock.mock({
    id: Mock.Random.increment(),
    deviceNo: Mock.Random.integer(10000),
    name: Mock.Random.cname(),
    count: Mock.Random.integer(0,100)
  }))
}

let _apis = {
  '/device/list': config => {
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
  '/device/add': config => {
    
  }
}

export default _apis
