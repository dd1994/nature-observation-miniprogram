// app.js
import './utils/libs/lodash-fix'
import './utils/libs/moment-zh-cn'

App({
  onLaunch() {
  },
  onShow() {
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