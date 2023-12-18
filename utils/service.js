function fetchPlantDetail({name, success, fail}) {
  wx.request({
    url: 'https://www.iplant.cn/ashx/getfrps.ashx',
    data: {
      key: name
    },
    success(res) {
      success(res)
    },
    fail(err) {
      fail(err)
    }
  })
}

module.exports = {
  fetchPlantDetail
}