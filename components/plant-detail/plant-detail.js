const computedBehavior = require('miniprogram-computed').behavior

Component({
  behaviors: [computedBehavior],
  properties: {
    taxon: null,
    taxonTree: null
  },
  computed: {
    frpsdesc(data) {
      return data?.taxon?.frpsdesc
    },
    taxonTreeTitle(data) {
      const taxonTree = data.taxonTree

      if (taxonTree) {
        const family = taxonTree.familyChineseName || taxonTree.family
        const genus = taxonTree.genusChineseName || taxonTree.genus

        return `${family}-${genus}`
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