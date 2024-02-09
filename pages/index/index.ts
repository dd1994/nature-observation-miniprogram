import ObservationsBehavior from '../../components/observations/observation';
import UserProfileBehavior from '../../components/user-profile/user-profile';
import { login } from '../../utils/service/login';
import { needFirstLogin } from '../../utils/util';
const computedBehavior = require('miniprogram-computed').behavior;
const app = getApp()
Page({
  behaviors: [computedBehavior, UserProfileBehavior, ObservationsBehavior],
  data: {
  },
  async onAddIconTap() {
    if (needFirstLogin()) {
      await login()
      app.globalData.indexPageNeedRefresh = true
    }
    wx.navigateTo({
      url: "/pages/observation-create/observation-create",
      events: {
        refresh: () => {
          this.resetAndFetchObservations()
        }
      }
    })
  },
  goToExplore() {
    wx.switchTab({
      url: '/pages/explore/index'
    })
  },
  onLoad() {
    this.resetAndFetchObservations()
  },
  onShow() {
    if (app.globalData.indexPageNeedRefresh) {
      this.resetAndFetchObservations()
    }
  },
  onReachBottom() {
    if (this.data.allLoaded) {
      return
    }
    this.setData({
      pageIndex: this.data.pageIndex + 1
    })
    this.fetchObservationList()
  },
  onPullDownRefresh() {
    this.resetAndFetchObservations().finally(() => {
      wx.stopPullDownRefresh()
    })
  },
  computed: {
    tab1Title(data) {
      return `记录(${data.observationsTotal})`
    },
    tab2Title(data) {
      return `物种(${data.observations.length})`
    },
    tab3Title(data) {
      return `鉴定(${data.observations.length})`
    },
    stickyProps(data) {
      return {
        // 'offsetTop': data.statusBarHeight
      }
    }
  }
})
