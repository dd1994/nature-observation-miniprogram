export const searchTaxon = ({ name, success, fail }) => {
  wx.request({
    url: 'https://api.inaturalist.org/v1/taxa/autocomplete',
    data: {
      q: name,
      locale: 'zh-CN',
      preferred_place_id: 6903,
      per_page: 30
    },
    success(res) {
      success(res)
    },
    fail(err) {
      fail(err)
    }
  })
}