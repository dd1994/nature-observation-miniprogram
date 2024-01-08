// components/animal-detail/animal-detail.js
import { fetchAnimalFaunaDetail } from '../../utils/service/plantApi'
import { generateCombinedChineseNameFromRankList, selectLatest3LevelRank } from '../taxon-tree/util'

const computedBehavior = require('miniprogram-computed').behavior

Component({
  behaviors: [computedBehavior],
  properties: {
    taxon: {},
    taxonTree: {}
  },

  /**
   * 组件的初始数据
   */
  data: {
    faunaContent: [] // 中国动物志
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
    externalResource(data) {
      return [{
        label: "联盟图片",
        url: `https://image.cubg.cn/search?sort=default&text=${encodeURIComponent(data.taxon.name)}&shitu=-1&taxonId=`
      }]
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    fetchDetail() {
      if (!this.data.taxon?.name) {
        return
      }
      fetchAnimalFaunaDetail({
        name: this.data.taxon.name
      }).then(res => {
        if (res?.length) {
          this.setData({
            faunaContent: res
          })
        }
      })
    }
  },
  lifetimes: {
    attached() {
      this.fetchDetail()
    }
  }
})