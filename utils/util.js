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

export function getOSSUrlByKey(key) {
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

export const formatExifGPSLongitude = (GPSLongitude, GPSLongitudeRef) => {
  if (GPSLongitude?.length) {
    const value = (GPSLongitude[0] + (GPSLongitude[1] / 60) + (GPSLongitude[2] / 3600)).toFixed(6)
    const ref = GPSLongitudeRef === 'E' ? 1 : -1
    return ref * value
  }
}


export const formatExifGPSLatitude = (GPSLatitude, GPSLatitudeRef) => {
  if (GPSLatitude?.length) {
    const value = (GPSLatitude[0] + (GPSLatitude[1] / 60) + (GPSLatitude[2] / 3600)).toFixed(6)
    const ref = GPSLatitudeRef === 'N' ? 1 : -1
    return ref * value
  }
}

