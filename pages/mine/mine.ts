import FullscreenBehavior from "../../components/fullscreen/fullscreen";
import { showErrorTips } from "../../utils/feedBack";
import { login } from "../../utils/service/login";
import { getUserProfile, getUserStatCount } from "../../utils/service/user"
import { isLogin, needFirstLogin } from "../../utils/util";
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
  async gotoUserHome() {
    if (isLogin()) {
      return wx.navigateTo({
        url: `/mine-packages/pages/user-home/user-home?user_id=${this.data.user?.id}`
      })
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
  async onAddIconTap() {
    if (needFirstLogin()) {
      await login()
      app.globalData.indexPageNeedRefresh = true
    }
    const isNewComer = wx.getStorageSync('newComer')
    if (isNewComer === false) {
      wx.chooseMedia({
        count: 20,
        sourceType: ['album'],
        sizeType: ['original'],
        mediaType: ['image'],
        success(res) {
          const files = res?.tempFiles || []
          if (files.length) {
            wx.navigateTo({
              url: `/pages/observation-create/observation-create?files=${encodeURIComponent(JSON.stringify(files))}`
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: "/pages/observation-create/observation-create"
      })
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

  onShow() {
    this.getUserProfile()
  }
})