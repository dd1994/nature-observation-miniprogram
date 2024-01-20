import { getUserProfile } from "../../utils/service/user"

Page({
  data: {
    user: null
  },
  onTabItemTap() {
    getUserProfile().then(res => {
      this.setData({
        user: res?.data?.data
      })
    })
  }
})