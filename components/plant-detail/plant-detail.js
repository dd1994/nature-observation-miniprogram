const computedBehavior = require('miniprogram-computed').behavior

Component({
  behaviors: [computedBehavior],
  properties: {
    taxon: null
  },
  computed: {
    frpsdesc(data) {
      return data?.taxon?.frpsdesc
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