const computedBehavior = require('miniprogram-computed').behavior
import { RankChineseMap } from '../../utils/constant'

Component({
  behaviors: [computedBehavior],
  properties: {
    taxonTree: {
      type: Array,
      value: [],
    },
    taxonTreeLoading: {
      value: false,
      type: Boolean
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
  // @ts-ignore
  computed: {
    rankList(data) {
      // return selectSubRankList(data.rank)
    },
    nameList(data) {
      // return generateNameList(data.rankList, data.taxonTree)
    },
    formattedTaxonTree(data) {
      return (data.taxonTree || []).map(i => {
        return {
          id: i.id,
          name: i.name,
          rank: i.rank,
          rankName: RankChineseMap[i.rank] || i.rank,
          preferred_common_name: i.preferred_common_name || i.name,
        }
      })
    }
  }
})