Component({
  properties: {
    observations: {
      type: Array,
      value: []
    },
  },
  data: {

  },
  methods: {
    gotoDetailPage(e) {
      wx.navigateTo({
        url: `/pages/observation-detail/observation-detail?id=${e.currentTarget.dataset.id}`,
        events: {
          refresh: () => {
            this.triggerEvent('refresh')
          }
        }
      })
    }
  }
})