const computedBehavior = require('miniprogram-computed').behavior

import { searchTaxon } from '../../utils/service/taxon'
import _ from 'lodash'
import { openTaxonDetail } from '../../utils/openTaxonDetail';

Page({
  behaviors: [computedBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    inputWords: '',
    searchResult: [],
    searchLoading: false,
    hidePicker: false,
    showConfirm: false,
    selectedTaxon: null,
    comments: '',
  },
  computed: {
  },
  commentsChange(e) {
    this.setData({ comments: e.detail.value })
  },
  selectTaxon(e) {
    this.setData({
      showConfirm: true,
      selectedTaxon: e.target.dataset.taxon,
      comments: '',
    })
  },
  confirmSelectTaxon() {
    const eventChannel = this.getOpenerEventChannel();
    wx.navigateBack({
      complete: () => {
        eventChannel.emit('backFromSearchPage', {
          ...this.data.selectedTaxon,
          comments: this.data.comments,
        })
      }
    })
  },
  cancelSelectTaxon() {
    this.setData({
      showConfirm: false,
      selectedTaxon: null,
      comments: '',
    })
  },
  viewTaxonDetail(e) {
    openTaxonDetail(e.currentTarget.dataset.taxon)
  },
  viewTaxonWhenHidePicker(e) {
    if (this.data.hidePicker) {
      this.viewTaxonDetail(e)
    }
  },
  searchWords: _.throttle(function (e) {
    // 请求接口
    this.setData({
      inputWords: e.detail.value
    })
    if (!this.data.inputWords.length) {
      return this.setData({ searchResult: [] })
    }
    this.setData({
      searchLoading: true
    })
    searchTaxon({ name: this.data.inputWords }).then((res: any) => {
      this.setData({
        searchLoading: false,
        searchResult: []
      })
      if (res?.data?.length) {
        this.setData({
          searchResult: (res?.data || [])
            .map(i => {
              const matched_term = (i.matched_term && (i.matched_term !== i.preferred_common_name)) ? `（${i.matched_term}）` : ''
              return {
                ...i,
                rank: i.rank === 'hybrid' ? 'species' : i.rank,
                displayName: (i.preferred_common_name || i.name) + matched_term
              }
            })
        })
      }
    }).catch(err => {
      this.setData({
        searchLoading: false
      })
      wx.showToast({
        title: '搜索失败，请稍后重试',
        icon: 'none'
      })
      this.setData({ searchResult: [] })
    })
  }, 2000),
  onLoad(options) {
    if (options.hidePicker) {
      this.setData({
        hidePicker: true
      })
    }
  },
  onShareAppMessage() {
    return {
      title: `生灵觅迹：物种查询`,
      path: "pages/taxon-picker/taxon-picker?hidePicker=1"
    }
  },
  onShareTimeline() {
    return {
      title: `生灵觅迹：物种查询`
    }
  }
})