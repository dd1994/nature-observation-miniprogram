Page({
  data: {
    user_id: null,
  },

  onLoad(options) {
    this.setData({
      user_id: options.user_id
    })
  }
})