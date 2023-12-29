// components/observation-list/observation-list.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    observations: {
      type: Array,
      value: []
    },
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
    gotoDetailPage(e) {
      wx.navigateTo({
        url: `/pages/observation-create/observation-create?id=${e.currentTarget.dataset.id}`,
        events: {
          refresh: () => {
            this.triggerEvent('refresh')
          }
        }
      })
    }
  }
})