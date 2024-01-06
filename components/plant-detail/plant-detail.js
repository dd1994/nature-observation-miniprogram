const computedBehavior = require('miniprogram-computed').behavior
import { generateCombinedChineseNameFromRankList, selectLatest3LevelRank } from '../taxon-tree/util'
import { fetchPlantFrpsDetail, fetchPlantFocnDetail } from '../../utils/service/plantApi'
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
    }
  },
  lifetimes: {
    attached() {
      this.fetchDetailFrpsDetail()
      this.fetchPlantFocnDetail()
    }
  }
})