import { getUserProfile, updateUserProfile } from "../../utils/service/user"

// pages/profile-setting/profile-setting.ts
Page({
  data: {
    userProfile: null
  },
  getUserProfile() {
    return getUserProfile().then((res: any) => {
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
    }).then((res: any) => {
      if (res?.data?.success) {
        wx.showToast({
          title: '保存成功',
        })
      }
    }).then(() => {
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/mine/mine'
        })
      }, 1500);
      this.getUserProfile()
    })
  },
  uploadAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album'],
    }).then((res: any) => {
      if (res?.tempFiles?.length) {
        console.log(res?.tempFiles?.[0]?.tempFilePath)
        console.log(res?.tempFiles?.[0]?.size)
      }
    })
  },
  onLoad() {
    this.getUserProfile()
  }
})