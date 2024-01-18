// app.js
import './utils/libs/lodash-fix'
import  '../../utils/libs/moment-zh-cn'


App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null
  }
})

// {
//   "pagePath": "pages/explore/index",
//   "text": "探索",
//   "iconPath": "./static/explore.png",
//   "selectedIconPath": "./static/explore-selected.png"
// },