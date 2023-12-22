import { requestPromise } from "./util"

export const fetchAdressByGPS = ({ lng, lat }) => {
  return requestPromise({
    url: 'https://restapi.amap.com/v3/geocode/regeo',
    data: {
      key: '377d2da6f4c386061ba9085a3bd42a34',
      location: `${lng},${lat}`
    }
  })
}