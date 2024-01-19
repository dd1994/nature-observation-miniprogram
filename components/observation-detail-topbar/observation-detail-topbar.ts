// components/observation-detail-topbar/observation-detail-topbar.js
const computedBehavior = require('miniprogram-computed').behavior;
import moment from 'moment'
Component({
  behaviors: [computedBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    userId: {
      type: String
    },
    userName: {
      type: String
    },
    userAvatar: {
      type: String,
      value: '../../static/default-avatar.png'
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