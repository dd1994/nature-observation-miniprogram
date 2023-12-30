import { fetchObservationDetail } from "../../utils/restful/observations"

// pages/observation-detail/observation-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    observationDetail: null
  },
  onLoad(options) {
    fetchObservationDetail(options.id).then(res => {
      this.setData({ observationDetail: res.data[0] })
    })
  }
})