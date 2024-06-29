import { generateDisplayRegion } from "../../../utils/util";

const computedBehavior = require('miniprogram-computed').behavior;
import moment from 'moment'

Page({
  behaviors: [computedBehavior],
  data: {
    region: ['全部', '全部', '全部'],
    taxon_id: null,
    taxon_preferred_common_name: null,
    taxon_name: null,
    startDate: '',
    endDate: '',
    today: moment(Date.now()).format('YYYY-MM-DD'),
    sortKey: 0,
    sortType: 0,
    sortKeyOptions: [
      {
        label: '上传日期',
        value: 'created_at',
      },
      {
        label: '拍照日期',
        value: 'observed_on'
      }
    ],
    sortTypeOptions: [
      {
        value: 'DESC',
        label: '降序'
      },
      {
        value: 'ASC',
        label: '升序'
      }
    ]
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
  bindEndDateChange(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  removeEndDate() {
    this.setData({
      endDate: ''
    })
  },
  bindSortTypeChange(e) {
    this.setData({
      sortType: e.detail.value
    })
  },
  bindSortKeyChange(e) {
    this.setData({
      sortKey: e.detail.value
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
            taxon_id: taxon?.id,
            taxon_preferred_common_name: taxon?.preferred_common_name || taxon?.name,
            taxon_name: taxon?.name,
          })
        }
      }
    })
  },
  removeTaxonFilter() {
    this.setData({
      taxon_id: null,
      taxon_preferred_common_name: null,
      taxon_name: null,
    })
  },
  confirmFilter() {
    const eventChannel = this.getOpenerEventChannel();
    wx.navigateBack({
      complete: () => {
        eventChannel.emit('backFromIndexFilterPage', {
          displayRegion: this.data.displayRegion,
          endDate: this.data.endDate,
          region: this.data.region,
          startDate: this.data.startDate,
          taxon_id: this.data.taxon_id,
          taxon_name: this.data.taxon_name,
          taxon_preferred_common_name: this.data.taxon_preferred_common_name,
        })
      }
    })
  },
  onLoad() {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('setDefaultFilter', (res) => {
      this.setData({
        ...res.filter
      })
    })
  },
  computed: {
    displayRegion(data) {
      return generateDisplayRegion(data.region)
    }
  }
})