// app.js
import './utils/libs/lodash-fix'
import './utils/libs/moment-zh-cn'
import { login } from './utils/service/login'
import { getUserProfile } from './utils/service/user'


App({
  onLaunch() {
    login().then(() => {
      return getUserProfile().then(res => {
        // @ts-ignore
        this.globalData.userInfo = res?.data?.data
      })
    })
  },
  globalData: {
    userInfo: null
  }
})