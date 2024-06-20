// app.js
import './utils/libs/lodash-fix'
import './utils/libs/moment-zh-cn'

App({
  onLaunch() {
    // wx.setEnableDebug({
    //   enableDebug: true,
    // })
  },
  onShow(options) {
    // 解决分享打开时数据为空的问题
    if ([1007, 1008].includes(options?.scene)) {
      this.globalData.explorePageNeedRefresh = true
    }
  },
  globalData: {
    userInfo: null,
    indexPageNeedRefresh: false, // 用于首页是否需要刷新的标记
    explorePageNeedRefresh: true, // 用于发现页是否需要刷新的标记
  }
})

// {
//   "pagePath": "pages/explore/index",
//   "iconPath": "@iconPath2",
//   "selectedIconPath": "@selectedIconPath2"
// },