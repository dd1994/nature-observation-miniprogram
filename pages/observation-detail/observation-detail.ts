import { openTaxonDetail } from "../../utils/openTaxonDetail";
import { fetchIdentificationList } from "../../utils/service/identifications";
import { fetchObservationDetail } from "../../utils/service/observations"
import { showErrorTips, showSuccessTips } from "../../utils/feedBack"
import _ from 'lodash';


const computedBehavior = require('miniprogram-computed').behavior;
import { createIdentification } from '../../utils/service/identifications'
import UserProfileBehavior from "../../components/user-profile/user-profile";
import { getImgQuality } from "../../utils/img";
import moment from "moment";
import { needFirstLogin } from "../../utils/util";
import { login } from "../../utils/service/login";
import { CustomFieldBehavior } from "../../components/custom-field/custom-field-behavior";
import { customFieldValueChangeType } from "../observation-create/util";
import { fetchCustomFieldValueHistory, removeCustomFieldValue, updateCustomFieldValue } from "../../utils/service/customField";
// pages/observation-detail/observation-detail.js
const app = getApp()

Page({
  behaviors: [computedBehavior, UserProfileBehavior, CustomFieldBehavior],
  data: {
    observationDetail: {},
    currentPhoto: 0,
    mapVisible: false,
    identifications: [],
    backIconTop: 0,
    backIconHeight: 0,
    showCustomFieldValueHistory: false,
    customFieldValueHistory: [],
    fabButton: {
      icon: 'share-1',
      theme: "light",
      openType: 'share',
    },
  },
  computed: {
    taxonInfo(data) {
      return _.pick(data.observationDetail, 'scientific_name', 'taxon_rank', 'iconic_taxon_name', 'taxon_id', 'common_name')
    },
    photos(data) {
      return (data.observationDetail?.photos || []).map(i => i.url)
    },
    swiperList(data) {
      return data.photos.map(i => {
        return {
          value: getImgQuality(i, 80),
        }
      })
    },
    id(data) {
      return data.observationDetail?.id
    },
    scientific_name(data) {
      return data.observationDetail?.scientific_name
    },
    iconic_taxon_name(data) {
      return data.observationDetail?.iconic_taxon_name
    },
    rank(data) {
      return data.observationDetail?.taxon_rank
    },
    common_name(data) {
      return data.observationDetail?.common_name
    },
    recommend_address_name(data) {
      if (data.observationDetail?.address_hidden) {
        return (data.observationDetail?.city || '') + (data.observationDetail?.district || '')
      } else {
        return data.observationDetail?.recommend_address_name
      }
    },
    description(data) {
      return data.observationDetail?.description
    },
    longitude(data) {
      return data.observationDetail?.longitude
    },
    latitude(data) {
      return data.observationDetail?.latitude
    },
    editUrl(data) {
      return `/pages/observation-create/observation-create?id=` + data.observationDetail?.id
    },
    isOwner(data) {
      return data.observationDetail?.user_id === data.userProfile?.id
    },
    formattedObservedOn(data) {
      return moment(data.observationDetail?.observed_on).format("YYYY-MM-DD")
    },
    backIconStyle(data) {
      return `
        position: fixed;
        // height: ${data.backIconHeight}px;
        top: ${data.backIconTop}px;
        left: 10px;
      `
    }
  },
  openMap() {
    wx.openLocation({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      name: this.data.recommend_address_name
    })
  },
  viewMapDetail() {
    this.setData({
      mapVisible: true
    })
  },
  edit() {
    wx.redirectTo({
      url: this.data.editUrl,
    })
  },
  onMapVisibleChange(e) {
    this.setData({
      mapVisible: e.detail.visible
    })
  },
  back() {
    wx.navigateBack({
    }).catch(() => {
      wx.switchTab({
        url: '/pages/explore/index'
      })
    })
  },
  onSwiperClick(e) {
    const index = e.detail.index
    wx.previewImage({
      urls: this.data.photos,
      showmenu: this.data.isOwner,
      current: this.data.photos[index],
    })
  },
  fetchObservationDetail(id?: string) {
    fetchObservationDetail(id || this.data.observationDetail?.id).then(res => {
      // @ts-ignore
      const data = res?.data?.[0]
      if (data) {
        this.setData({
          observationDetail: data
        })
        if (data.taxon_source !== 'CFH') {
          this.fetchCustomFieldConfig(data.taxon_id)
        }
      }
    }).then(() => {
      this.fetchIdentificationList()
    })
  },
  onLoad(options) {
    this.fetchObservationDetail(options.id)
    this.fetchCustomFieldValue(options.id)
    const res = wx.getMenuButtonBoundingClientRect()

    this.setData({
      backIconTop: res.top,
      backIconHeight: res.height,
    })
  },
  openTaxonDetail() {
    openTaxonDetail({
      name: this.data.scientific_name,
      rank: this.data.rank,
      iconic_taxon_name: this.data.iconic_taxon_name,
      id: this.data.taxon_id
    })
  },
  fetchIdentificationList() {
    fetchIdentificationList({ observation_id: this.data.observationDetail?.id }).then(res => {
      this.setData({
        // @ts-ignore
        identifications: res.data
      })
    })
  },
  async agreeID(e) {
    wx.showLoading({
      title: ''
    })
    if (needFirstLogin()) {
      await login()
      app.globalData.indexPageNeedRefresh = true
    }
    const ID = e.detail
    createIdentification({
      observation_id: this.data.id,
      common_name: ID.common_name,
      scientific_name: ID.scientific_name,
      taxon_rank: ID.taxon_rank,
      iconic_taxon_name: ID.iconic_taxon_name,
      taxon_id: ID.taxon_id,
    }).then(() => {
      showSuccessTips('添加鉴定成功')
      this.fetchObservationDetail()
    }).catch(err => {
      showErrorTips('添加鉴定失败，请稍后重试')
    })
  },
  async addIdentification() {
    if (needFirstLogin()) {
      await login()
      app.globalData.indexPageNeedRefresh = true
    }

    wx.navigateTo({
      url: '/pages/taxon-picker/taxon-picker?needConfirm=1',
      events: {
        backFromSearchPage: (taxon) => {
          createIdentification({
            observation_id: this.data.id,
            common_name: taxon.preferred_common_name || taxon.name,
            scientific_name: taxon.name,
            taxon_rank: taxon.rank,
            iconic_taxon_name: taxon.iconic_taxon_name,
            taxon_id: taxon.id,
            comments: taxon.comments,
            taxon_source: taxon.taxon_source
          }).then(() => {
            showSuccessTips('添加鉴定成功')
            this.fetchObservationDetail()
          }).catch(err => {
            showErrorTips('添加鉴定失败，请稍后重试')
          })
        }
      }
    })
  },
  onShareAppMessage() {
    return {
      title: `${this.data?.observationDetail?.user_name}的记录：${this.data.common_name}`,
      path: `pages/observation-detail/observation-detail?id=${this.data.id}`
    }
  },
  onShareTimeline() {
    return {
      title: `${this.data?.observationDetail?.user_name}的记录：${this.data.common_name}`
    }
  },
  customFieldValueChange(e) {
    this.setData({
      customFieldValue: e.detail.value
    })

    if (e.detail?.change?.type === customFieldValueChangeType.remove) {
      removeCustomFieldValue(this.data.id, e.detail?.change?.value).then(() => {
        this.refreshCustomField()
      })
    } else if (e.detail?.change?.type === customFieldValueChangeType.udpate) {
      updateCustomFieldValue({
        observation_id: this.data.id, value: e.detail?.change?.value,
      }).then(() => {
        this.refreshCustomField()
        showSuccessTips('添加成功')
      })
    }
  },
  refreshCustomField() {
    this.fetchCustomFieldConfig(this.data.observationDetail.taxon_id)
    this.fetchCustomFieldValue(this.data.id)
  },
  viewCustomFieldValueHistory() {
    fetchCustomFieldValueHistory(this.data.id).then(res => {
      this.setData({
        // @ts-ignore
        customFieldValueHistory: (res.data || []).map(i => {
          if (i.extra) {
            return {
              ...i,
              updated_at: moment(i.updated_at).fromNow(),
              extra: JSON.parse(i.extra)
            }
          } else {
            return {
              ...i,
              updated_at: moment(i.updated_at).fromNow(),
            }
          }
        })
      })
    })
    this.setData({
      showCustomFieldValueHistory: true,
    })
  },
  closeCustomFieldValueHistoryDialog() {
    this.setData({
      showCustomFieldValueHistory: false,
    })
  }
})