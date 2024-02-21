import { fetchObservationExploreList, fetchObservationList } from "../../utils/service/observations"
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
  },
  methods: {
    activeTabChange(e) {
      this.setData({ activeTab: e.detail.value })
    },
    onAddIconTap() {
      wx.navigateTo({
        url: "/pages/observation-create/observation-create",
      })
    }
  },
  onLoad() {
    this.resetAndFetchObservations()
    this.resetAndFetchTaxon()
  },
  onShow() {
    if (app.globalData.indexPageNeedRefresh) {
      this.resetAndFetchObservations()
      this.resetAndFetchTaxon()
    }
  },
  onReachBottom() {
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
  onPullDownRefresh() {
    this.resetAndFetchTaxon()
    this.resetAndFetchObservations().finally(() => {
      wx.stopPullDownRefresh()
    })
  },
  gotoIndexSearch() {
    wx.navigateTo({
      url: "/pages/index-search/index-search"
    })
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
  }
})
