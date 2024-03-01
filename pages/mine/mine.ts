import FullscreenBehavior from "../../components/fullscreen/fullscreen";
import { showErrorTips } from "../../utils/feedBack";
import { login } from "../../utils/service/login";
import { getUserProfile, getUserStatCount } from "../../utils/service/user"
import { isLogin } from "../../utils/util";
const computedBehavior = require('miniprogram-computed').behavior;

const app = getApp()
Page({
  behaviors: [computedBehavior, FullscreenBehavior],
  data: {
    user: null,
    loginLoding: false,
    statCount: {},
  },
  computed: {
    displayName(data) {
      return data.user?.user_name || '点击登录'
    },
    pageTop(data) {
      return data.statusBarHeight + data.navBarHeight
    }
  },
  async login() {
    if (isLogin()) {
      return showErrorTips('个人主页正在开发中，敬请期待~')
    }
    wx.showLoading({
      title: '登录中...'
    })
    this.setData({
      loginLoding: true
    })
    try {
      await login()
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

    getUserStatCount().then(res => {
      // @ts-ignore
      if (res?.data?.success) {
        // @ts-ignore
        this.setData({
          statCount: res.data.data
        })
      }
    })
  },
  onTabItemTap() {
    this.getUserProfile()
  },
  onShow() {
    this.getUserProfile()
  }
})