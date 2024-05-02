import ObservationsBehavior from '../../components/observation-list/observationBehavior';
import TaxonBehavior from '../../components/taxon-list/taxonBehavior';
import UserProfileBehavior from '../../components/user-profile/user-profile';
import { login } from '../../utils/service/login';
import { needFirstLogin } from '../../utils/util';
import { TabType } from './../index/constant';
const app = getApp()

const computedBehavior = require('miniprogram-computed').behavior;
Page({
  behaviors: [computedBehavior, UserProfileBehavior, ObservationsBehavior, TaxonBehavior],
  data: {
    activeTab: TabType.observations,
    needLogin: false,
    top: 0
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
    this.resetAndFetchObservations()
    this.resetAndFetchTaxon()
    const res = wx.getMenuButtonBoundingClientRect()
    const top = res.bottom
    this.setData({
      top
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
      this.resetAndFetchObservations()
      this.resetAndFetchTaxon()
      app.globalData.explorePageNeedRefresh = false
    }
  },
  refresh() {
    this.resetAndFetchTaxon()
    this.resetAndFetchObservations().finally(() => {
      wx.stopPullDownRefresh()
    })
  },

  gotoIndexFilter() {
    wx.navigateTo({
      url: '/pages/taxon-picker/taxon-picker',
      success: (res) => {
        // 发送一个事件
        res.eventChannel.emit('setPlaceholder', { placeholder: '按任意类群过滤，比如“蜘蛛目”' })
      },
      events: {
        backFromSearchPage: (taxon) => {
          if (!taxon?.id) {
            return
          }

          this.setData({
            q: {
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
      url: "/pages/index-search/index-search"
    })
  },
  removeSearch() {
    this.setData({
      q: {}
    })
    this.resetAndFetchObservations()
    this.resetAndFetchTaxon()
  },
  onShareAppMessage() {
    return {
      title: '生灵觅迹，记录身边的自然',
      path: "pages/explore/index"
    }
  },
  onShareTimeline() {
    return {
      title: '生灵觅迹，记录身边的自然'
    }
  }
})
