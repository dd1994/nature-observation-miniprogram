import { openTaxonDetail } from "../../utils/openTaxonDetail";
import { fetchIdentificationList } from "../../utils/service/identifications";
import { fetchObservationDetail } from "../../utils/service/observations"
const computedBehavior = require('miniprogram-computed').behavior;
import { createIdentification } from '../../utils/service/identifications'

// pages/observation-detail/observation-detail.js
Page({
  behaviors: [computedBehavior],
  data: {
    observationDetail: {},
    currentPhoto: 0,
    mapVisible: false,
    identifications: []
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
    id(data) {
      return data.observationDetail?.id
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
    recommend_address_name(data) {
      return data.observationDetail?.city + data.observationDetail?.recommend_address_name
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
      const data = res?.data?.[0]
      if (data) {
        this.setData({
          observationDetail: {
            ...data
          }
        })
      } else {
        th
      }
    }).then(() => {
      this.fetchIdentificationList()
    })
  },
  openTaxonDetail() {
    openTaxonDetail({
      name: this.data.scientific_name,
      rank: this.data.rank,
      iconic_taxon_name: this.data.iconic_taxon_name
    })
  },
  fetchIdentificationList() {
    fetchIdentificationList({ observation_id: this.data.observationDetail?.id }).then(res => {
      this.setData({
        identifications: res.data
      })
    })
  },
  addIdentification() {
    wx.navigateTo({
      url: '/pages/taxon-picker/taxon-picker',
      events: {
        backFromSearchPage: (taxon) => {
          createIdentification({
            observation_id: this.data.id,
            common_name: taxon.preferred_common_name,
            scientific_name: taxon.name,
            taxon_rank: taxon.rank,
            iconic_taxon_name: taxon.iconic_taxon_name,
            taxon_id: taxon.id,
            user_id: 1,
          }).then(() => {
            this.fetchIdentificationList()
          }).catch(err => {
            wx.showToast({
              title: '添加鉴定失败，请稍后重试',
              icon: 'none',
              duration: 3000
            })
          })
        }
      }
    })
  },
})