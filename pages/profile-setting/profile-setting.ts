import UUID from "pure-uuid"
import { showErrorTips } from "../../utils/feedBack"
import uploadOSS, { avatarHost } from "../../utils/service/uploadOSS"
import { getUserAvatarUrl, getUserProfile, updateUserProfile } from "../../utils/service/user"

// pages/profile-setting/profile-setting.ts
Page({
  data: {
    userProfile: null,
  },
  getUserProfile() {
    return getUserProfile().then((res: any) => {
      const userProfile = res?.data?.data
      this.setData({
        userProfile
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
      avatar: this.data?.userProfile?.avatar
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
      sizeType: ['compressed']
    }).then((res: any) => {
      if (res?.tempFiles?.length) {
        const uuid = (new UUID(1)).toString()
        const task = uploadOSS({
          filePath: res?.tempFiles?.[0]?.tempFilePath,
          key: uuid,
          url: avatarHost,
          success: (res) => {
            this.fieldChange('avatarUrl', getUserAvatarUrl(uuid))
            this.fieldChange('avatar', uuid)
          },
          fail: (err) => {
            showErrorTips('图片上传失败，请稍后重试')
            console.error(err)
          }
        })
      }
    })
  },
  onLoad() {
    this.getUserProfile()
  }
})