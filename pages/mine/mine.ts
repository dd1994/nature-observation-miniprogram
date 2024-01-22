import { login } from "../../utils/service/login";
import { getUserProfile } from "../../utils/service/user"
import { isLogin } from "../../utils/util";
const computedBehavior = require('miniprogram-computed').behavior;

const app = getApp()
Page({
  behaviors: [computedBehavior],
  data: {
    user: app.globalData.userInfo,
    loginLoding: false
  },
  computed: {
    displayName(data) {
      return data.user?.user_name || '点击登录'
    }
  }
})