import ObservationsBehavior from "../../../components/observation-list/observationBehavior"
import TaxonBehavior from "../../../components/taxon-list/taxonBehavior"
import { TabType } from "../../../pages/index/constant";
import { getUserProfileWithOutLogin } from "../../../utils/service/user"
const computedBehavior = require('miniprogram-computed').behavior;

Page({
  behaviors: [computedBehavior, ObservationsBehavior, TaxonBehavior],
  data: {
    activeTab: TabType.observations,
    user_id: null,
    userProfile: null,
    needLogin: false,
  },
  computed: {
    tab1Title(data) {
      return `记录(${data.observationsTotal})`
    },
    tab2Title(data) {
      return `物种(${data.taxonTotal})`
    },
  },
  onLoad(options) {
    this.setData({
      user_id: options.user_id
    })
    this.getUserProfile()
    this.resetAndFetchObservations()
    this.resetAndFetchTaxon()
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
  activeTabChange(e) {
    this.setData({ activeTab: e.detail.value })
  },
  openStatPage() {
    wx.navigateTo({
      url: `/mine-packages/pages/stat/stat?user_id=${this.data?.user_id}`
    })
  },
  getUserProfile() {
    getUserProfileWithOutLogin(this.data.user_id).then(res => {
      this.setData({
        // @ts-ignore
        userProfile: res?.data?.data
      })
    })
  },
  onShareAppMessage() {
    return {
      title: `${this.data?.userProfile?.user_name}的个人主页`,
      path: `mine-packages/pages/user-home/user-home?user_id=${this.data.user_id}`
    }
  },
  onShareTimeline() {
    return {
      title: `${this.data?.userProfile?.user_name}的个人主页`,
    }
  }
})