// pages/taxon-picker/taxon-picker.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputWords: '',
    searchResult: []
  },
  searchWords(e) {
    // 请求接口
    wx.request({
      url: 'http://www.sp2000.org.cn/api/v2/getNameByKeyword',
      data: {
        apiKey: '95cf54522c3c48c88d4ab800ec33eb0f',
        keyword: this.data.inputWords
      },
      success: (res) => {
        if(res?.data?.names?.length) {
          this.setData({searchResult: res.data.names})
        }
      },
      fail: (err) => {
        this.setData({searchResult: []})
      }
    })
  }
})