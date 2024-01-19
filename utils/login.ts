export const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        debugger
        wx.request({
          url: 'http://localhost:7001/api/v1/wxmini/openid',
          data: {
            code: res.code
          },
          success(res) {
            debugger
            resolve(res)
            console.log('openid = ', res.data)
          }
        })
      },
      fail(err) {
        reject(err)
      }
    })
  })
}
