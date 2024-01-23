import { login } from "../../utils/service/login";
import { getUserProfile } from "../../utils/service/user"
import { isLogin } from "../../utils/util";
const computedBehavior = require('miniprogram-computed').behavior;

const app = getApp()
Page({
  behaviors: [computedBehavior],
  data: {
    user: null,
    loginLoding: false
  },
  computed: {
    displayName(data) {
      return data.user?.user_name || '点击登录'
    }
  },
  async login() {
    if (isLogin()) {
      return
    }
    wx.showLoading({
      title: '登录中...'
    })
    this.setData({
      loginLoding: true
    })
    try {
      await login()
      app.globalData.firstLoginFlag = true
      await this.getUserProfile()
    } catch (error) {
    } finally {
      wx.hideLoading()
    }
  },
  getUserProfile() {
    getUserProfile().then(res => {
      // @ts-ignore
      if (res?.data?.success) {
        // @ts-ignore
        const userInfo = res?.data?.data
        this.setData({
          user: userInfo
        })
        app.globalData.userInfo = userInfo
      }
    })
  },
  onTabItemTap() {
    this.getUserProfile()
  }
})