export const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        debugger
        wx.request({
          url: 'http://localhost:7001/api/v1/login',
          data: {
            code: res.code
          },
          success(res) {
            // @ts-ignore
            if (res?.data.success) {
              // @ts-ignore
              wx.setStorageSync('token', res?.data?.data?.token)
              resolve(true)
            } else {
              // @ts-ignore
              reject(res?.data?.message)
            }
          }
        })
      },
      fail(err) {
        reject(err)
      }
    })
  })
}
