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
    photos(data) {
      return (data.observationDetail?.photos || []).map(i => i.url)
    },
    swiperList(data) {
      return data.photos.map(i => {
        return {
          value: i,
        }
      })
    },
    scientific_name(data) {
      return data.observationDetail?.scientific_name
    },
    common_name(data) {
      return data.observationDetail?.common_name
    },
    recommend_name(data) {
      return data.observationDetail?.recommend_name
    },
    description(data) {
      return data.observationDetail?.description
    }
  },
  onSwiperClick(e) {
    const index = e.detail.index
    wx.previewImage({
      urls: this.data.photos,
      showmenu: false,
      current: this.data.photos[index],
    })
  },
  onLoad(options) {
    fetchObservationDetail(options.id).then(res => {
      this.setData({ observationDetail: res.data[0] })
    })
  }
})