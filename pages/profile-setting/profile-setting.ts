import { getUserProfile, updateUserProfile } from "../../utils/service/user"

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
  save() {
    return updateUserProfile({
      user_name: this.data?.userProfile?.user_name,
      bio: this.data?.userProfile?.bio,
      avatar: this.data.avatar
    }).then(res => {
      if (res?.data?.success) {
        wx.showToast({
          title: '保存成功',
        })
      }
    }).then(() => {
      wx.switchTab({
        url: '/pages/mine/mine'
      })
      this.getUserProfile()
    })
  },
  onLoad() {
    this.getUserProfile()
  }
})