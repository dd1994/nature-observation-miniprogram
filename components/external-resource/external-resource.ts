// components/external-resource/external-resource.js
Component({
  properties: {
    resource: {
      value: []
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
    copy(e) {
      wx.setClipboardData({
        data: e.currentTarget.dataset.url,
        success(res) {
          wx.getClipboardData({
            success(res) {
              wx.showToast({
                title: '链接复制成功，请粘贴到外部浏览器打开',
                icon: 'none',
                duration: 3000,
              })
            }
          })
        }
      })
    }
  }
})