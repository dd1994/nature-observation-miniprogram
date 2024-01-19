import { fetchObservationList } from '../../utils/service/observations'
const computedBehavior = require('miniprogram-computed').behavior;

Page({
  behaviors: [computedBehavior],
  data: {
    observations: [],
    limit: 20,
    offset: 0,
  },
  fetchObservations() {
    fetchObservationList().then(res => {
      this.setData({
        observations: res.data
      })
    })
  },
  onAddIconTap() {
    wx.navigateTo({
      url: "/pages/observation-create/observation-create",
      events: {
        refresh: () => {
          this.fetchObservations()
        }
      }
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
