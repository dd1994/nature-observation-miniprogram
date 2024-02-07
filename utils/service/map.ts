const QMapKey = '4BVBZ-M7ACQ-MKQ5E-4UCDH-46TUQ-EUB6H'; //使用在腾讯位置服务申请的key
const AMapKey = '377d2da6f4c386061ba9085a3bd42a34'
const referer = '自然记录'; //调用插件的app的名称

import { requestPromise } from "../util"

export const translateGPS = async (params: { lng: string, lat: string }) => {
  try {
    const res = await requestPromise({
      url: 'https://restapi.amap.com/v3/assistant/coordinate/convert',
      data: {
        key: AMapKey,
        type: 1,
        coordsys: 'gps',
        locations: `${params.lng},${params.lat}`
      }
    })
    // @ts-ignore
    const [lng, lat] = res.data.locations.split(',') || [params.lng, params.lat]
    return { lat, lng }
  } catch (error) {
    console.error(error)
    return params
  }
}
export const fetchAdressByGPS = ({ lng, lat }) => {
  return requestPromise({
    url: 'https://restapi.amap.com/v3/geocode/regeo',
    data: {
      key: AMapKey,
      location: `${lng},${lat}`,
      radius: 1, // 限制距离，距离太大会搜出奇怪的结果
    }
  })
}

export function goToLocationSelector({ lat, lng }) {
  let url = 'plugin://chooseLocation/index?key=' + QMapKey + '&referer=' + referer
  if (lat && lng) {
    url = url + '&location=' + JSON.stringify({
      latitude: lat,
      longitude: lng
    })
  }

  wx.navigateTo({
    url: url
  });
}
