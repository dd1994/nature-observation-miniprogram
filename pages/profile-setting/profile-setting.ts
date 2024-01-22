import { getUserProfile } from "../../utils/service/user"

// pages/profile-setting/profile-setting.ts
Page({
  data: {
    userProfile: null
  },
  getUserProfile() {
    return getUserProfile().then(res => {
      this.setData({
        userProfile: res?.data?.data
      })
    })
  },
  onLoad() {
    this.getUserProfile()
  }
})