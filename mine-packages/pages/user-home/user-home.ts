import ObservationsBehavior from "../../../components/observation-list/observationBehavior"
import TaxonBehavior from "../../../components/taxon-list/taxonBehavior"
import IdBehavior from "../../../components/id-list/idBehavior"

import { TabType } from "../../../pages/index/constant";
import { openTaxonDetail } from "../../../utils/openTaxonDetail";
import { getUserProfileWithOutLogin } from "../../../utils/service/user"
import { trimUrlParams } from "../../../utils/util";
const computedBehavior = require('miniprogram-computed').behavior;

Page({
  behaviors: [computedBehavior, ObservationsBehavior, TaxonBehavior, IdBehavior],
  data: {
    activeTab: TabType.observations,
    user_id: null,
    userProfile: null,
    needLogin: false,
    fabButton: {
      icon: 'share-1',
      theme: "light",
      openType: 'share',
    },
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
    this.resetAllTabAndFetch()
  },
  resetAllTabAndFetch() {
    this.resetAndFetchObservations()
    this.resetAndFetchTaxon()
    this.resetAndFetchIndexId()
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
  applyTaxonFilter(e) {
    const { taxon } = e.detail
    openTaxonDetail({
      name: taxon.scientific_name,
      rank: taxon.taxon_rank,
      iconic_taxon_name: taxon.iconic_taxon_name,
      id: taxon.taxon_id
    })
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
  activeTabChange(e) {
    this.setData({ activeTab: e.detail.value })
  },
  openStatPage() {
    wx.navigateTo({
      url: `/mine-packages/pages/stat/stat?user_id=${this.data?.user_id}`
    })
  },
  previewUserAvatar() {
    wx.previewImage({
      urls: [trimUrlParams(this.data.userProfile.avatarUrl)]
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