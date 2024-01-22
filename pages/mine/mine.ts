import { login } from "../../utils/service/login";
import { getUserProfile } from "../../utils/service/user"
const computedBehavior = require('miniprogram-computed').behavior;

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
    return getUserProfile().then(res => {
      this.setData({
        user: res?.data?.data
      })
    })
  },
  onTabItemTap() {
    this.getUserProfile()
  }
})