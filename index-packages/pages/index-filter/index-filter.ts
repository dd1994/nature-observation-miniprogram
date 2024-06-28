import { generateDisplayRegion } from "../../../utils/util";

const computedBehavior = require('miniprogram-computed').behavior;
import moment from 'moment'

Page({
  behaviors: [computedBehavior],
  data: {
    region: ['全部', '全部', '全部'],
    taxon: null,
    startDate: '',
    endDate: '',
    today: moment(Date.now()).format('YYYY-MM-DD')
  },
  bindRegionChange(e) {
    this.setData({
      region: e.detail.value,
    })
  },
  removeRegion() {
    this.setData({
      region: ['全部', '全部', '全部'],
    })
  },
  bindStartDateChange(e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  removeStartDate() {
    this.setData({
      startDate: ''
    })
  },
  gotoTaxonFilter() {
    wx.navigateTo({
      url: '/pages/taxon-picker/taxon-picker',
      success: (res) => {
        // 发送一个事件
        res.eventChannel.emit('setPlaceholder', { placeholder: '搜索感兴趣的类群，比如“蜘蛛目”' })
      },
      events: {
        backFromSearchPage: (taxon) => {
          if (!taxon?.id) {
            return
          }

          this.setData({
            taxon: {
              taxon_id: taxon?.id,
              taxon_preferred_common_name: taxon?.preferred_common_name || taxon?.name,
              taxon_name: taxon?.name,
            }
          })
        }
      }
    })
  },
  removeTaxonFilter() {
    this.setData({
      taxon: null,
    })
  },
  computed: {
    displayRegion(data) {
      return generateDisplayRegion(data.region)
    }
  }
})