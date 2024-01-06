const computedBehavior = require('miniprogram-computed').behavior
import { generateCombinedChineseNameFromRankList, selectLatest3LevelRank } from '../taxon-tree/util'

Component({
  behaviors: [computedBehavior],
  properties: {
    taxon: {},
    taxonTree: {}
  },
  computed: {
    frpsdesc(data) {
      return data?.taxon?.frpsdesc
    },
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
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  lifetimes: {
  }
})