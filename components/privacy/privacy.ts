import { showErrorTips } from "../../utils/feedBack"

// component/privacy/privacy.js
Component({
  /**
   * 组件的初始数据
   */
  data: {
    privacyContractName: '《生灵觅迹小程序隐私保护指引》',
    showPrivacy: false
  },
  pageLifetimes: {
    show() {
      const agreePrivacy = wx.getStorageSync('agreePrivacy')
      if (!agreePrivacy) {
        this.setData({
          showPrivacy: true //res.needAuthorization
        })
      }
    }
  },
  methods: {
    // 打开隐私协议页面
    openPrivacyContract() {
      wx.openPrivacyContract({
        fail: () => {
          wx.showToast({
            title: '遇到错误',
            icon: 'error'
          })
        }
      })
    },
    // 拒绝隐私协议
    exitMiniProgram() {
      showErrorTips('请同意隐私保护政策后才可以继续上传记录')
      setTimeout(() => {
        wx.navigateBack()
      }, 2000)
    },
    // 同意隐私协议
    handleAgreePrivacyAuthorization() {
      this.setData({
        showPrivacy: false
      })
      wx.setStorageSync('agreePrivacy', true)
    },
    // 通过绑定空事件禁止滑动事件的穿透
    handleCatchtouchMove() {
      return
    }
  },
})