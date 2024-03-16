// mine-packages/pages/ai-tools/ai-tools.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  openByAppId(appId: string) {
    wx.navigateToMiniProgram({
      appId: appId
    })
  },
  openXiaochong() {
    this.openByAppId('wxa0283c99163682c1')
  }
})