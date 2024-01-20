export const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
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
              // @ts-ignore
              wx.setStorageSync('user', res?.data?.data?.user)
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
