const key = '4BVBZ-M7ACQ-MKQ5E-4UCDH-46TUQ-EUB6H'; //使用在腾讯位置服务申请的key
const referer = '自然记录'; //调用插件的app的名称

import { requestPromise } from "../util"

export const fetchAdressByGPS = ({ lng, lat }) => {
  return requestPromise({
    url: 'https://apis.map.qq.com/ws/geocoder/v1',
    data: {
      key,
      location: `${lat},${lng}`
    }
  })
}

export function goToLocationSelector({ lat, lng }) {
  let url = 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer
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
