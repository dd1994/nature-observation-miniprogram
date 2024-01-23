import { login } from '../../utils/service/login';
import { fetchObservationList } from '../../utils/service/observations'
import { needFirstLogin } from '../../utils/util';
const computedBehavior = require('miniprogram-computed').behavior;
const app = getApp()
Page({
  behaviors: [computedBehavior],
  data: {
    observations: [],
    limit: 20,
    offset: 0,
    isEmpty: false,
  },
  fetchObservations() {
    fetchObservationList().then(res => {
      this.setData({
        observations: res?.data?.data || []
      })
      if (!this.data.observations.length) {
        this.setData({
          isEmpty: true
        })
      }
    })
  },
  async onAddIconTap() {
    if (needFirstLogin()) {
      await login()
    }
    wx.navigateTo({
      url: "/pages/observation-create/observation-create",
      events: {
        refresh: () => {
          this.fetchObservations()
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
    this.fetchObservations()
  },
  onShow() {
  },
  computed: {
    tab1Title(data) {
      return `观察（${data.observations.length}）`
    },
    tab2Title(data) {
      return `物种（${data.observations.length - 3}）`
    },
  }
})
