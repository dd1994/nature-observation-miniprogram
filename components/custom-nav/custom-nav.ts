const computedBehavior = require('miniprogram-computed').behavior;

Component({
  behaviors: [computedBehavior],
  properties: {

  },
  data: {
    statusBarHeight: 0,
    navBarHeight: 0,
  },
  // @ts-ignore
  computed: {
    style(data: any) {
      return `padding-top: ${data.statusBarHeight + 'px'};height: ${data.navBarHeight + 'px'}`
    }
  },
  lifetimes: {
    attached() {
      const statusBarHeight = wx.getSystemInfoSync().statusBarHeight
      const menu = wx.getMenuButtonBoundingClientRect()
      const navBarHeight = (menu.top - statusBarHeight) * 2 + menu.height


      this.setData({
        statusBarHeight,
        navBarHeight,
      })
    }
  }
})