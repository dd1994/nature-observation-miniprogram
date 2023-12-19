const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

function getOSSUrlByKey(key) {
  return `https://observation-images.oss-cn-beijing.aliyuncs.com/${key}`
}

export const requestPromise = (params) => {
  return new Promise((resolve, reject) => {
      wx.request({
          ...params,  //  请求的参数
          success: (result) => {
              resolve(result)
          },
          fail: (err) => { reject(err) },
      })
  });
}
module.exports = {
  formatTime,
  getOSSUrlByKey,
  requestPromise
}
