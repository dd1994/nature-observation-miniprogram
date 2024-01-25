const FullscreenBehavior = Behavior({
  data: {
    statusBarHeight: 0,
    navBarHeight: 0
  },
  lifetimes: {
    attached() {
      const statusBarHeight = wx.getSystemInfoSync().statusBarHeight
      const menu = wx.getMenuButtonBoundingClientRect()
      const navBarHeight = (menu.top - statusBarHeight) * 2 + menu.height

      this.setData({
        statusBarHeight,
        navBarHeight
      })
    }
  }
})

export default FullscreenBehavior