// pages/import-from-inaturalist/import-from-inaturalist.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  async uploadFile() {
    try {
      const res = await wx.chooseMessageFile({
        count: 1,
        type: 'file',
        extension: ['csv']
      })
      debugger
      wx.showToast({
        title: '选择失败'
      })
    } catch (error) {
      console.log(error)
      wx.showToast({
        title: '选择失败'
      })
    }
    wx.showToast({
      title: '选择成功'
    })
  }
})