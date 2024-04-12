import { showSuccessTips } from "../../../utils/feedBack"

// pages/setting/setting.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },
  logout() {
    wx.removeStorage({ key: 'token' })
    wx.removeStorage({ key: 'user' })
    showSuccessTips('退出成功')
    wx.restartMiniProgram({ path: '/pages/index/index' })
  }
})