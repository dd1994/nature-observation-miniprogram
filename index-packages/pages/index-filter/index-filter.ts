import { generateDisplayRegion } from "../../../utils/util";

const computedBehavior = require('miniprogram-computed').behavior;
import moment from 'moment'
import { sortKeyOptions, sortTypeOptions } from "../../../utils/constant";

Page({
  behaviors: [computedBehavior],
  data: {
    region: ['全部', '全部', '全部'],
    taxon_id: null,
    taxon_preferred_common_name: null,
    taxon_name: null,
    startDate: '',
    endDate: '',
    sortKey: 0,
    sortType: 0,
    today: moment(Date.now()).format('YYYY-MM-DD'),
    sortKeyOptions: sortKeyOptions,
    sortTypeOptions: sortTypeOptions
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
  resetFilter() {
    this.setData({
      region: ['全部', '全部', '全部'],
      taxon_id: null,
      taxon_preferred_common_name: null,
      taxon_name: null,
      startDate: '',
      endDate: '',
      sortKey: 0,
      sortType: 0,
    })
    this.confirmFilter()
  },
  confirmFilter() {
    const eventChannel = this.getOpenerEventChannel();
    wx.navigateBack({
      complete: () => {
        eventChannel.emit('backFromIndexFilterPage', this.data.formattedFilterValue)
      }
    })
  },
  onLoad() {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('setDefaultFilter', (res) => {
      const sortKeyIndex = sortKeyOptions.findIndex(i => i.value === res?.filter?.sortKey)
      const sortTypeIndex = sortTypeOptions.findIndex(i => i.value === res?.filter?.sortType)

      this.setData({
        ...res.filter,
        sortKey: sortKeyIndex === -1 ? 0 : sortKeyIndex,
        sortType: sortTypeIndex == -1 ? 0 : sortTypeIndex
      })
    })
  },
  computed: {
    displayRegion(data) {
      return generateDisplayRegion(data.region)
    },
    formattedFilterValue(data) {
      let sortTips = ''
      if ((data.sortType == 0) && (data.sortKey == 0)) {
        // 默认排序，不展示任何提示
        sortTips = ''
      } else {
        const sortTypeLabel = sortTypeOptions[data.sortType]?.label
        const sortKeyLabel = sortKeyOptions[data.sortKey]?.label
        sortTips = `按${sortKeyLabel}${sortTypeLabel}`
      }
      return {
        displayRegion: data.displayRegion,
        endDate: data.endDate,
        region: data.region,
        startDate: data.startDate,
        taxon_id: data.taxon_id,
        taxon_name: data.taxon_name,
        taxon_preferred_common_name: data.taxon_preferred_common_name,
        sortType: sortTypeOptions[data.sortType].value,
        sortKey: sortKeyOptions[data.sortKey].value,
        sortTips
      }
    }
  }
})