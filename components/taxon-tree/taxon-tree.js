const computedBehavior = require('miniprogram-computed').behavior

// auditSpecialists: "Jin Xiaohua"
// class: "Magnoliopsida"
// classChineseName: "木兰纲"
// created_at: "2023-12-16T03:55:12.000Z"
// family: "Dioscoreaceae"
// familyChineseName: "薯蓣科"
// genus: "Dioscorea"
// genusChineseName: "薯蓣属"
// id: 89921
// kingdom: "Plantae"
// kingdomChineseName: "植物界"
// order: "Dioscoreales"
// orderChineseName: "薯蓣目"
// phylum: "Tracheophyta"
// phylumChineseName: "维管植物门"
// species: "Dioscorea polystachya"
// speciesChineseName: "薯蓣"
// updated_at: "2023-12-16T03:55:12.000Z"
// version: "2023
Component({
  behaviors: [computedBehavior],
  properties: {
    taxonTree: null,
    rank: null
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  computed: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})