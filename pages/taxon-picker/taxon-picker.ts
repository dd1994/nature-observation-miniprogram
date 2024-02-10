const computedBehavior = require('miniprogram-computed').behavior
import { searchTaxon } from '../../utils/service/taxon'
import _ from 'lodash'
import { openTaxonDetail } from '../../utils/openTaxonDetail';
import { validRankList } from '../../components/taxon-tree/util';

Page({
  behaviors: [computedBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    inputWords: '',
    searchResult: [],
    searchLoading: false,
    hidePicker: false
  },
  computed: {
  },
  selectTaxon(e) {
    const eventChannel = this.getOpenerEventChannel();
    wx.navigateBack({
      url: '/pages/observation-create/observation-create',
      complete: () => {
        eventChannel.emit('backFromSearchPage', e.target.dataset.taxon)
      }
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
              return {
                ...i,
                rank: i.rank === 'hybrid' ? 'species' : i.rank
              }
            })
            .filter(i => {
              return validRankList.includes(i.rank)
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
  }
})