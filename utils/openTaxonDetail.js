function openBirdDetail(name) {
  // 感谢懂鸟: https://mp.weixin.qq.com/s/FK1G67KM96yqMBYSdwcEHA
  wx.openEmbeddedMiniProgram({
    appId: 'wx0d6a77cb8b27cf91',
    path: 'pages/detail/detail?name=' + encodeURIComponent(name),
  });
}

module.exports = {
  openBirdDetail
}