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
  fieldChange(field: string, val: string) {
    this.setData({
      userProfile: {
        ...this.data.userProfile,
        [field]: val
      }
    })
  },
  nameChange(e) {
    this.fieldChange('user_name', e.detail.value)
  },
  bioChange(e) {
    this.fieldChange('bio', e.detail.value)
  },
  onLoad() {
    this.getUserProfile()
  }
})