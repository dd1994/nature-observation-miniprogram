// components/user-name-and-avatar/user-name-and-avatar.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    userProfile: {
      type: Object,
      value: {}
    },
    color: {
      type: String,
      value: 'rgba(0, 0, 0, 0.4)'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    gotoUserHome() {
      wx.navigateTo({
        url: `/mine-packages/pages/user-home/user-home?user_id=${this.data?.userProfile?.user_id}`
      })
    }
  }
})