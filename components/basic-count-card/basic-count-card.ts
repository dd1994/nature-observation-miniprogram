import { showErrorTips } from "../../utils/feedBack"

// components/basic-count-card/basic-count-card.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    statCount: {
      type: Object,
      value: {}
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
    showTips() {
      showErrorTips("统计页面正在开发中，敬请期待~")
    }
  }
})