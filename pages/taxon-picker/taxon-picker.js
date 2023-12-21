const computedBehavior = require('miniprogram-computed').behavior
import { searchTaxon } from '../../utils/inaturalistApi'
import '../../utils/lodash-fix'
import _ from 'lodash'

Page({
  behaviors: [computedBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    inputWords: '',
    taxonDetailDialogVisible: false,
    searchResult: [],
    clickTaxon: null,
    searchLoading: false,

    //     hierarchyCode: "Animalia_Chordata_Aves_Passeriformes_Pycnonotidae_Pycnonotus_Pycnonotus sinensis"
    // name: "Pycnonotus sinensis"
    // nameCode: "14b35463-5451-46f6-abd1-819082387624"
    // name_c: "白头鹎"
    // name_py: "bái tóu bēi"
    // parentId: "ec706686-fe91-4dc6-a88e-b288590b0ca6"
    // pyabbr: "btb"
    // rank: "Species"
    // taxongroup: "鸟类"
  },
  computed: {
  },
  selectTaxon(e) {
    wx.navigateTo({
      url: '/pages/observation-create/observation-create',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromSearchPage', { taxon: e.target.dataset.taxon })
      }
    })
  },
  viewTaxonDetail(e) {
    this.setData({
      clickTaxon: e.currentTarget.dataset.taxon,
      taxonDetailDialogVisible: true
    })
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
    searchTaxon({
      name: this.data.inputWords,
      success: (res) => {
        this.setData({
          searchLoading: false,
          searchResult: []
        })
        if (res?.data?.results?.length) {
          this.setData({ searchResult: res?.data?.results })
        }
      },
      fail: (err) => {
        this.setData({
          searchLoading: false
        })
        wx.showToast({
          title: '搜索失败，请稍后重试',
          icon: 'none'
        })
        this.setData({ searchResult: [] })
      }
    })
  }, 2000)
})