import { login } from "./service/login"

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
  return `https://observation-images.nature-notes.com/${key}`
}

export function trimUrlParams(url: string) {
  return url.split("?")[0];
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


export function requestPromiseWithLogin(params) {
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,  //  请求的参数
      data: {
        ...params.data,
        token: wx.getStorageSync('token')
      },
      success: (result) => {
        if ((result?.data?.code === -1) && !needFirstLogin()) {
          // 如果登录失效，重新登录
          return login().then(() => {
            return requestPromiseWithLogin(params)
              .then(res => {
                resolve(res)
              }).catch(err => {
                reject(err)
              })
          })
        } else {
          resolve(result)
        }
      },
      fail: (err) => { reject(err) },
    })
  });
}

export const formatExifGPSLongitude = (GPSLongitude, GPSLongitudeRef) => {
  if (GPSLongitude?.length) {
    const value = (GPSLongitude[0] + (GPSLongitude[1] / 60) + (GPSLongitude[2] / 3600)).toFixed(12)
    const ref = GPSLongitudeRef === 'E' ? 1 : -1
    return ref * value
  }
}

export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}



export const formatExifGPSLatitude = (GPSLatitude, GPSLatitudeRef) => {
  if (GPSLatitude?.length) {
    const value = (GPSLatitude[0] + (GPSLatitude[1] / 60) + (GPSLatitude[2] / 3600)).toFixed(12)
    const ref = GPSLatitudeRef === 'N' ? 1 : -1
    return ref * value
  }
}


export const generateUrlWithParams = (url, params) => {
  const keys = Object.keys(params)
  return url + '?' + keys.map(key => {
    return `${key}=${encodeURIComponent(params[key])}`
  }).join("&")
}

export const removeRichTextTag = (str) => {
  return str.replace(/<\/?.+?>/g, "")
}

export const needFirstLogin = () => {
  return !wx.getStorageSync('token')
}

export const isLogin = () => {
  return !!wx.getStorageSync('token')
}
