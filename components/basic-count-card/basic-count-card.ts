import { showErrorTips } from "../../utils/feedBack"
const computedBehavior = require('miniprogram-computed').behavior
// components/basic-count-card/basic-count-card.ts
Component({
  behaviors: [computedBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    statCount: {
      type: Object,
      value: {}
    },
    userId: {
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
    userStatUrl(data) {
      return `/mine-packages/pages/stat/stat?user_id=${data?.userId}`
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showTips() {
      showErrorTips("统计页面正在开发中，敬请期待~")
    }
  }
})