import { fetchObservationList } from '../../utils/service/observations'

Page({
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
  }
})
