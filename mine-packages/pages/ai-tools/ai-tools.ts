// mine-packages/pages/ai-tools/ai-tools.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fabButton: {
      icon: 'share-1',
      theme: "light",
      openType: 'share',
    },
  },
  openByAppId(appId: string) {
    wx.navigateToMiniProgram({
      appId: appId
    })
  },
  openXiaochong() {
    this.openByAppId('wxa0283c99163682c1')
  },
  openXingse() {
    this.openByAppId('wx66aed246411799b2')
  },
  openHuabanlv() {
    this.openByAppId('wx28184e60cbbdc44b')
  },
  openWenhao() {
    this.openByAppId('wx2f147e41f13ba243')
  },
  openDongniao() {
    wx.openEmbeddedMiniProgram({
      appId: 'wx0d6a77cb8b27cf91',
      path: 'pages/index/index'
    });
  },
  openDongliangpa() {
    wx.openEmbeddedMiniProgram({
      appId: 'wxfa3bd55035d29110',
      path: 'pages/index/index'
    });
  },
  openGuanniaojun() {
    this.openByAppId('wx9ea5ac1d223a7fe6')
  },
  onShareAppMessage() {
    return {
      title: '智能动植物识别工具推荐',
      path: "mine-packages/pages/ai-tools/ai-tools"
    }
  },
  onShareTimeline() {
    return {
      title: '智能动植物识别工具推荐',
    }
  }
})