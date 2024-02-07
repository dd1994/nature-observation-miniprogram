import { getUserProfile } from "../../utils/service/user"

const UserProfileBehavior = Behavior({
  data: {
    userProfile: {},
  },
  lifetimes: {
    attached() {
      wx.getStorage({
        key: 'user',
        success: (res) => {
          this.setData({
            userProfile: res.data
          })
        }
      })
    }
  }
})

export default UserProfileBehavior