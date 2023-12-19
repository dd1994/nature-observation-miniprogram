// pages/taxon-picker/taxon-picker.js
const { openBirdDetail } = require('../../utils/openTaxonDetail')
const { fetchPlantDetail, fetchAnimalDetail } = require('../../utils/service')
const computedBehavior = require('miniprogram-computed').behavior

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
    clickTaxonGroup(data) {
      return data?.clickTaxon?.taxonInfo?.taxongroup
    }
  },
  selectTaxon(e) {
    debugger
  },

  viewTaxonDetail(e) {
    const taxonInfo = e.currentTarget.dataset.taxon
    const defaultAction = () => {
      wx.showToast({
        title: '暂时没有更多关于该物种的信息了~',
        icon: 'none',
        duration: 2500
      })
    }
    const actionMap = {
      "鸟类": () => {
        openBirdDetail(taxonInfo.name)
      },
      "植物": () => {
        fetchPlantDetail({
          name: taxonInfo.name,
          success: (res) => {
            if (res?.data?.frpsdesc) {
              this.setData({
                clickTaxon: {
                  detail: res.data,
                  taxonInfo: taxonInfo
                }
              })
              this.onTaxonDetailDialogVisibleChange({ detail: { visible: true } })
            } else {
              wx.showToast({
                title: '暂时没有更多关于该物种的信息了',
                icon: 'none'
              })
              // 植物志没有数据，想想从其它接口搞点数据过来
            }
          },
          fail: (err) => {

          }
        })
      },
      "昆虫": () => {
        debugger
        fetchAnimalDetail({
          name: taxonInfo.name,
          success: (res) => {
            this.setData({
              clickTaxon: {
                detail: res,
                taxonInfo: taxonInfo
              }
            })
          },
          fail: (err) => {
            debugger
          }
        })
      }
    }
    debugger
    ; (actionMap[taxonInfo.taxongroup] || defaultAction)()
  },
  onTaxonDetailDialogVisibleChange(e) {
    this.setData({
      taxonDetailDialogVisible: e.detail.visible
    })
    if (!e.detail.visible) {
      this.setData({
        clickTaxon: null
      })
    }

  },
  searchWords(e) {
    // 请求接口
    this.setData({
      inputWords: e.detail.value
    })
    if (!this.data.inputWords.length) {
      return this.setData({ searchResult: [] })
    }
    wx.request({
      url: 'http://www.sp2000.org.cn/api/v2/getNameByKeyword',
      data: {
        apiKey: '95cf54522c3c48c88d4ab800ec33eb0f',
        keyword: this.data.inputWords
      },
      success: (res) => {
        const resData = res?.data
        if (resData?.code !== 200) {
          wx.showToast({
            title: resData?.message || '请求失败',
            icon: 'none'
          })
        } else {
          if (resData?.data?.names?.length) {
            this.setData({ searchResult: resData.data.names })
          }
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '搜索失败，请稍后重试',
          icon: 'none'
        })
        this.setData({ searchResult: [] })
      }
    })
  }
})