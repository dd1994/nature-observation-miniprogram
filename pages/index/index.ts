import UserProfileBehavior from '../../components/user-profile/user-profile';
import { login } from '../../utils/service/login';
import { fetchObservationList } from '../../utils/service/observations'
import { needFirstLogin } from '../../utils/util';
const computedBehavior = require('miniprogram-computed').behavior;
const app = getApp()
Page({
  behaviors: [computedBehavior, UserProfileBehavior],
  data: {
    observations: [],
    pageSize: 20,
    pageIndex: 1,
    total: 0,
    isEmpty: false,
  },
  fetchObservationList() {
    return fetchObservationList({ pageIndex: this.data.pageIndex, pageSize: this.data.pageSize }).then(res => {
      this.setData({
        // @ts-ignore
        observations: (this.data.observations || []).concat(res?.data?.data || [])
      })
      if (!this.data.observations.length && (this.pageIndex === 1)) {
        this.setData({
          isEmpty: true
        })
      } else {
        this.setData({
          isEmpty: false
        })
      }
    })
  },
  resetAndFetchObservations() {
    this.setData({
      pageIndex: 1,
      observations: []
    })
    this.fetchObservationList()
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
      return `记录(${data.observations.length})`
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
