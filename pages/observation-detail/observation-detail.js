import { openTaxonDetail } from "../../utils/openTaxonDetail";
import { fetchObservationDetail } from "../../utils/restful/observations"
const computedBehavior = require('miniprogram-computed').behavior;

// pages/observation-detail/observation-detail.js
Page({
  behaviors: [computedBehavior],
  data: {
    observationDetail: {},
    currentPhoto: 0,
    mapVisible: false,
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
    iconic_taxon_name(data) {
      return data.observationDetail?.iconic_taxon_name
    },
    rank(data) {
      return data.observationDetail?.taxon_rank
    },
    common_name(data) {
      return data.observationDetail?.common_name
    },
    recommend_name(data) {
      return data.observationDetail?.city + data.observationDetail?.recommend_name
    },
    description(data) {
      return data.observationDetail?.description
    },
    mapUrl(data) {
      return `/pages/observation-map/observation-map?longitude=${data.longitude}&latitude=${data.latitude}`
    },
    longitude(data) {
      return data.observationDetail?.longitude
    },
    latitude(data) {
      return data.observationDetail?.latitude
    },
    editUrl(data) {
      return `/pages/observation-create/observation-create?id=` + data.observationDetail?.id
    }
  },
  viewMapDetail() {
    this.setData({
      mapVisible: true
    })
  },
  edit() {
    wx.redirectTo({
      url: this.data.editUrl,
    })
  },
  onMapVisibleChange(e) {
    this.setData({
      mapVisible: e.detail.visible
    })
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
  },
  openTaxonDetail() {
    openTaxonDetail({
      name: this.data.scientific_name,
      rank: this.data.rank,
      iconic_taxon_name: this.data.iconic_taxon_name
    })
  }
})