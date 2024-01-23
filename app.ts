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
    firstLoginFlag: false // 第一次登录后的标记，用于第一次登录后切换 tab 时进行刷新
  }
})