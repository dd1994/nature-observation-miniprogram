const computedBehavior = require('miniprogram-computed').behavior
import { generateCombinedChineseNameFromRankList, selectLatest3LevelRank } from '../taxon-tree/util'
import { fetchPlantFrpsDetail, fetchPlantFocnDetail } from '../../utils/service'
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
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    frpsdesc: '', // 中国植物志
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
        name: this.data.taxon.name,
        success: (res) => {
          if (res?.data?.frpsdesc) {
            this.setData({
              frpsdesc: res.data.frpsdesc
            })
          }
        },
        fail: (err) => {
        }
      })
    },
    fetchPlantFocnDetail() {
      if (!this.data?.taxon?.name) {
        return
      }

      fetchPlantFocnDetail({
        name: this.data.taxon.name,
        success: (res) => {
          debugger
          if (res?.data) {
            this.setData({
              focnContent: res.data
            })
          }
        },
        fail: (err) => {
        }
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