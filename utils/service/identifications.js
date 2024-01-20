import { generateUrlWithParams, requestPromise, requestPromiseWithLogin } from "../util"

export function fetchIdentificationList(params) {
  return requestPromise({
    method: 'POST',
    url: 'http://192.168.3.40:7001/api/v1/identifications',
    data: params
  })
}

export function createIdentification(params) {
  return requestPromiseWithLogin({
    url: 'http://192.168.3.40:7001/api/v1/identifications',
    method: 'POST',
    data: params
  })
}