// components/animal-detail/animal-detail.js
import { fetchAnimalFaunaDetail } from '../../utils/service/plantApi'
import { generateCombinedChineseNameFromRankList, selectLatest3LevelRank } from '../taxon-tree/util'

const computedBehavior = require('miniprogram-computed').behavior

Component({
  behaviors: [computedBehavior],
  properties: {
    taxon: {
      value: {},
      type: Object
    },
    taxonTree: {
      value: [],
      type: Array
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
    faunaContent: [] // 中国动物志
  },
  // @ts-ignore
  computed: {
    taxonTreeTitle(data) {
      return '分类'
    },
    externalResource(data) {
      return [{
        label: "联盟图片",
        url: `https://image.cubg.cn/search?sort=default&text=${encodeURIComponent(data.taxon.name)}&shitu=-1&taxonId=`,
        desc: '索引了全球320个主题网站的720万张图片，涵盖全球45万个物种，图片鉴定基本准确可靠。'
      }]
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    fetchDetail() {
    }
  },
  lifetimes: {
    attached() {
      this.fetchDetail()
    }
  }
})