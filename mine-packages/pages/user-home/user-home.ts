import { getUserProfileWithOutLogin } from "../../../utils/service/user"

Page({
  data: {
    user_id: null,
    userProfile: null,
  },

  onLoad(options) {
    this.setData({
      user_id: options.user_id
    })
    this.getUserProfile()
  },
  getUserProfile() {
    getUserProfileWithOutLogin(this.data.user_id).then(res => {
      this.setData({
        // @ts-ignore
        userProfile: res?.data?.data
      })
    })
  }
})