// components/observation-detail-topbar/observation-detail-topbar.js
const computedBehavior = require('miniprogram-computed').behavior;
import moment from 'moment'
Component({
  behaviors: [computedBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    userProfile: {
      type: Object,
      value: {}
    },
    observedOn: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  // @ts-ignore
  computed: {
    formattedObservedOn(data) {
      return moment(data.observedOn).format("YYYY-MM-DD")
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})