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
  login() {
    if (isLogin()) {
      return
    }
    wx.showLoading({
      title: '登录中...'
    })
    this.setData({
      loginLoding: true
    })
    login().then(() => {
      return this.getUserProfile()
    }).finally(() => {
      wx.showToast({
        title: '登录成功'
      })
    })
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