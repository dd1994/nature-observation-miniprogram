import { fetchObservationDetail } from "../../utils/restful/observations"
const computedBehavior = require('miniprogram-computed').behavior;

// pages/observation-detail/observation-detail.js
Page({
  behaviors: [computedBehavior],
  data: {
    observationDetail: null,
    currentPhoto: 0,
  },
  computed: {
    swiperList(data) {
      return (data.observationDetail?.photos || []).map(i => {
        return {
          value: i.url,
        }
      })
    }
  },
  onLoad(options) {
    fetchObservationDetail(options.id).then(res => {
      this.setData({ observationDetail: res.data[0] })
    })
  }
})