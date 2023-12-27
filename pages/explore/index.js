Component({
  data: {
    observations: [],
    limit: 20,
    offset: 0,
  },
  methods: {
    fetchObservations() {
      wx.request({
        url: 'http://192.168.3.40:7001/api/v1/observations',
        success: (res) => {
          this.setData({
            observations: res.data
          })
        }
      })
    },
    onAddIconTap() {
      wx.navigateTo({
        url: "/pages/observation-create/observation-create",

      })
    }
  },
  created() {
    this.fetchObservations()
  },
  onShow() {
    this.fetchObservations()
  }
})
