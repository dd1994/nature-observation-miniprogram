// app.js
import './utils/libs/lodash-fix'
import './utils/libs/moment-zh-cn'
import { login } from './utils/service/login'
import { getUserProfile } from './utils/service/user'


App({
  onLaunch() {
  },
  globalData: {
    userInfo: null,
    indexPageNeedRefresh: false, // 用于首页是否需要刷新的标记
  }
})