const computedBehavior = require('miniprogram-computed').behavior
import { generateCombinedChineseNameFromRankList, selectLatest3LevelRank } from '../taxon-tree/util'
import { fetchPlantFrpsDetail, fetchPlantFocnDetail, fetchPlantFrpsPhoto } from '../../utils/service/plantApi'
Component({
  behaviors: [computedBehavior],
  properties: {
    taxon: {},
    taxonTree: {}
  },
  computed: {
    taxonTreeTitle(data) {
      const taxonTree = data.taxonTree
      if (taxonTree) {
        const rankList = selectLatest3LevelRank(data.taxon?.rank)
        return generateCombinedChineseNameFromRankList(rankList, data.taxonTree)
      } else {
        return '分类'
      }
    },
    frpsdesc(data) {
      return data.frpsContent?.frpsdesc
    },
    externalResource(data) {
      return [{
        label: "联盟图片",
        url: `https://image.cubg.cn/search?sort=default&text=${encodeURIComponent(data.taxon.name)}&shitu=-1&taxonId=`
      }]
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    frpsContent: null, // 中国植物志
    focnContent: null // Flower  of China 翻译版
  },

  /**
   * 组件的方法列表
   */
  methods: {
    fetchDetailFrpsDetail() {
      if (!this.data?.taxon?.name) {
        return
      }

      fetchPlantFrpsDetail({
        name: this.data.taxon.name
      }).then((res) => {
        if (res?.data?.frpsdesc) {
          this.setData({
            frpsContent: res.data
          })
        }
        return res
      }).then(res => {
        if (res?.data?.zwzsutu) {
          fetchPlantFrpsPhoto({ appphoto: res.data.zwzsutu }).then(res => {
            if (res?.data) {
              this.setData({
                frpsContent: {
                  ...this.data.frpsContent,
                  photoUrl: "https://img1.iplant.cn/imgf/b/" + res.data
                }
              })
            }
          })
        }
      })
    },
    fetchPlantFocnDetail() {
      if (!this.data?.taxon?.name) {
        return
      }

      fetchPlantFocnDetail({
        name: this.data.taxon.name
      }).then((res) => {
        if (res?.data) {
          this.setData({
            focnContent: res.data
          })
        }
      })
    },
    previewFrpsPhoto() {
      wx.previewImage({
        urls: [this.data?.frpsContent?.photoUrl],
      })
    }
  },
  lifetimes: {
    attached() {
      this.fetchDetailFrpsDetail()
      this.fetchPlantFocnDetail()
    }
  }
})