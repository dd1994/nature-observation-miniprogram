// components/index-tab/index-tab.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    activeTab: {
      type: Number,
    },
    tabs: {
      type: Array
    }
  },


  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTabChange(e) {
      this.triggerEvent('onTabChange', {
        value: e.currentTarget.dataset.item
      })

      if (e.currentTarget.dataset.item === this.data.activeTab) {
        this.triggerEvent('refresh')
      }
    }
  }
})