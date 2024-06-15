import IdBehavior from '../../components/id-list/idBehavior';
import ObservationsBehavior from '../../components/observation-list/observationBehavior';
import TaxonBehavior from '../../components/taxon-list/taxonBehavior';
import UserProfileBehavior from '../../components/user-profile/user-profile';
import { login } from '../../utils/service/login';
import { generateUrlWithParams, needFirstLogin } from '../../utils/util';
import { TabType } from './constant';
const computedBehavior = require('miniprogram-computed').behavior;
const app = getApp()
Page({
  behaviors: [computedBehavior, UserProfileBehavior, ObservationsBehavior, TaxonBehavior, IdBehavior],
  data: {
    activeTab: TabType.observations,
    needLogin: true,
    filterPanelVisible: false,
    tabTop: 0,
    filterIconTop: 0,
    filterIconHeight: 0,
    scollViewHeight: 0,
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
  goToExplore() {
    wx.switchTab({
      url: '/pages/explore/index'
    })
  },
  onLoad() {
    this.resetAllTabAndFetch()

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
  onShow() {
    if (app.globalData.indexPageNeedRefresh) {
      this.resetAllTabAndFetch()
      app.globalData.indexPageNeedRefresh = false
    }
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
    } else if (this.data.activeTab === TabType.taxon) {
      if (this.data.taxonAllLoaded) {
        return
      }
      this.setData({
        taxonPageIndex: this.data.taxonPageIndex + 1
      })
      this.fetchTaxonList()
    } else {
      if (this.data.idAllLoaded) {
        return
      }
      this.setData({
        idPageIndex: this.data.idPageIndex + 1
      })
      this.fetchIndexIdList()
    }
  },
  refresh() {
    if (this.data.activeTab === TabType.observations) {
      this.resetAndFetchObservations().finally(() => {
        wx.stopPullDownRefresh()
      })
    } else if (this.data.activeTab === TabType.taxon) {
      this.resetAndFetchTaxon()
    } else {
      this.resetAndFetchIndexId()
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
              taxon_id: taxon?.id,
              taxon_preferred_common_name: taxon?.preferred_common_name || taxon?.name,
              taxon_name: taxon?.name,
            }
          })
          this.resetAllTabAndFetch()
        }
      }
    })
    // wx.navigateTo({
    //   url: "/pages/index-search/index-search?needLogin=true"
    // })
  },
  resetAllTabAndFetch() {
    this.resetAndFetchObservations()
    this.resetAndFetchTaxon()
    this.resetAndFetchIndexId()
  },
  gotoIndexSearch() {
    wx.navigateTo({
      url: "/pages/index-search/index-search?needLogin=true"
    })
  },
  removeSearch() {
    this.setData({
      q: {}
    })
    this.resetAllTabAndFetch()
  },
  openFilterPanel() {
    wx.navigateTo({
      url: "/pages/index-filter/index-filter"
    })
  },
  onFilterPanelVisibleChange(e) {
    this.setData({
      filterPanelVisible: e.detail.visible,
    });
  },
  computed: {
    tab1Title(data) {
      return `记录(${data.observationsTotal})`
    },
    tab2Title(data) {
      return `物种(${data.taxonTotal})`
    },
    tab3Title(data) {
      return `鉴定(${data.observations.length})`
    },
    stickyProps(data) {
      return {
        // 'offsetTop': data.statusBarHeight
      }
    }
  },
  onShareAppMessage() {
    return {
      title: '记录身边物种，参与公民科学',
      path: "pages/index/index"
    }
  },
  onShareTimeline() {
    return {
      title: '记录身边物种，参与公民科学'
    }
  }
})
