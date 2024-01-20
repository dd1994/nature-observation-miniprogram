import { getUserProfile } from "../../utils/service/user"

Page({
  data: {
    user: null
  },
  onLoad() {
    getUserProfile().then(res => {
      this.setData({
        user: res?.data?.data
      })
    })
  }
})