import { apiDomain } from "../constant"
import { getUserProfile } from "./user"

export const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        wx.request({
          url: apiDomain + '/api/v1/login',
          method: 'POST',
          data: {
            code: res.code
          },
          success(res) {
            // @ts-ignore
            if (res?.data.success) {
              // @ts-ignore
              wx.setStorageSync('token', res?.data?.data?.token)
              getUserProfile().then(res => {
                wx.setStorage({
                  key: 'user',
                  // @ts-ignore
                  data: res.data.data,
                })
              })
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
