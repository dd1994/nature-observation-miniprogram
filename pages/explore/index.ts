import ObservationsBehavior from '../../components/observation-list/observationBehavior';
import TaxonBehavior from '../../components/taxon-list/taxonBehavior';
import UserProfileBehavior from '../../components/user-profile/user-profile';
import { login } from '../../utils/service/login';
import { generateDisplayRegion, generateUrlWithParams, needFirstLogin } from '../../utils/util';
import { TabType } from './../index/constant';
import _ from 'lodash';
const app = getApp()

const computedBehavior = require('miniprogram-computed').behavior;
Page({
  behaviors: [computedBehavior, UserProfileBehavior, ObservationsBehavior, TaxonBehavior],
  data: {
    activeTab: TabType.observations,
    needLogin: false,
    tabTop: 0,
    filterIconTop: 0,
    filterIconHeight: 0,
    scollViewHeight: 0,
    displayRegion: '',
  },
  bindRegionChange(e) {
    this.setData({
      q: {
        ...this.data.q,
        region: e.detail.value,
      }
    })
    this.setData({
      // 这里本来应该用 computed 的，但是 skyline 渲染模式下 computed 没法用。。。
      displayRegion: generateDisplayRegion(e.detail.value)
    })
    this.resetAllTabAndFetch()
  },
  removeRegion() {
    this.setData({
      q: {
        ...this.data.q,
        region: ['全部', '全部', '全部'],
      }
    })
    this.setData({
      // 这里本来应该用 computed 的，但是 skyline 渲染模式下 computed 没法用。。。
      displayRegion: ''
    })
    this.resetAllTabAndFetch()
  },
  removeTaxonFilter() {
    this.setData({
      q: {
        region: this.data.q.region,
      }
    })
    this.resetAllTabAndFetch()
  },
  activeTabChange(e) {
    this.setData({ activeTab: e.detail.value })
  },
  async onAddIconTap() {
    if (needFirstLogin()) {
      await login()
      app.globalData.indexPageNeedRefresh = true
    }

    const isNewComer = wx.getStorageSync('newComer')
    if (isNewComer === false) {
      wx.chooseMedia({
        count: 20,
        sourceType: ['album'],
        sizeType: ['original'],
        mediaType: ['image'],
        success(res) {
          const files = res?.tempFiles || []
          if (files.length) {
            wx.navigateTo({
              url: `/pages/observation-create/observation-create?files=${encodeURIComponent(JSON.stringify(files))}`
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: "/pages/observation-create/observation-create"
      })
    }
  },
  onLoad() {
    if (app.globalData.explorePageNeedRefresh) {
      this.onShow()
    } else {
      // hack: 这里是为了解决分享到群聊后打开数据为空的问题，很奇怪
      this.resetAllTabAndFetch()
    }

    const res = wx.getMenuButtonBoundingClientRect()
    const windowInfo = wx.getWindowInfo()
    const tabTop = res.bottom
    const filterIconTop = res.top
    const filterIconHeight = res.height

    // 必须要给 scoll-view 一个固定高度
    this.setData({
      tabTop,
      filterIconTop,
      filterIconHeight,
      scollViewHeight: windowInfo.windowHeight - tabTop - 46
    })
  },
  bindscrolltolower() {
    if (this.data.activeTab === TabType.observations) {
      if (this.data.observationsAllLoaded) {
        return
      }
      this.setData({
        observationsPageIndex: this.data.observationsPageIndex + 1
      })
      this.fetchObservationList()
    } else {
      if (this.data.taxonAllLoaded) {
        return
      }
      this.setData({
        taxonPageIndex: this.data.taxonPageIndex + 1
      })
      this.fetchTaxonList()
    }
  },
  onShow() {
    if (app.globalData.explorePageNeedRefresh) {
      if (app.globalData?.exploreQ) {
        this.setData({
          q: _.cloneDeep(app.globalData.exploreQ),
          // 这里本来应该用 computed 的，但是 skyline 渲染模式下 computed 没法用。。。
          displayRegion: generateDisplayRegion(app.globalData.exploreQ?.region)
        })
        app.globalData.exploreQ = null
      }
      this.resetAllTabAndFetch()
      app.globalData.explorePageNeedRefresh = false
    }
  },
  refresh() {
    if (this.data.activeTab === TabType.observations) {
      this.resetAndFetchObservations().finally(() => {
        wx.stopPullDownRefresh()
      })
    } else {
      this.resetAndFetchTaxon()
    }
  },
  applyTaxonFilter(e) {
    const { taxon } = e.detail

    this.setData({
      q: {
        ...this.data.q,
        taxon_id: taxon?.taxon_id,
        taxon_preferred_common_name: taxon?.common_name || taxon?.scientific_name,
        taxon_name: taxon?.scientific_name,
      }
    })
    this.resetAllTabAndFetch()
    this.setData({ activeTab: TabType.observations })
  },
  gotoIndexFilter() {
    wx.navigateTo({
      url: '/pages/taxon-picker/taxon-picker',
      success: (res) => {
        // 发送一个事件
        res.eventChannel.emit('setPlaceholder', { placeholder: '过滤感兴趣的类群，比如“蜘蛛目”' })
      },
      events: {
        backFromSearchPage: (taxon) => {
          if (!taxon?.id) {
            return
          }

          this.setData({
            q: {
              ...this.data.q,
              taxon_id: taxon?.id,
              taxon_preferred_common_name: taxon?.preferred_common_name || taxon?.name,
              taxon_name: taxon?.name,
            }
          })
          this.resetAndFetchObservations()
          this.resetAndFetchTaxon()
        }
      }
    })
  },
  gotoIndexSearch() {
    wx.navigateTo({
      url: "/index-packages/pages/index-search/index-search"
    })
  },
  removeSearch() {
    this.setData({
      q: {},
      displayRegion: '',
    })
    this.resetAllTabAndFetch()
  },
  resetAllTabAndFetch() {
    this.resetAndFetchObservations()
    this.resetAndFetchTaxon()
  },
  onShareAppMessage() {
    return {
      title: '记录身边物种，参与公民科学',
      path: "pages/explore/index"
    }
  }
})
