export const showSuccessTips = (text) => {
  wx.showToast({
    title: text
  })
}

export const showErrorTips = (text) => {
  wx.showToast({
    title: text,
    icon: 'none'
  })
}
