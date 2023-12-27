Component({
  data: {
    observations: [],
    limit: 20,
    offset: 0,
  },
  methods: {
    fetchObservations() {
      wx.request({
        url: 'http://127.0.0.1:7001/api/v1/observations',
        success: (res) => {
          this.setData({
            observations: res.data
          })
        }
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
