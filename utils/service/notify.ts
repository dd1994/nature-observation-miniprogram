import { apiDomain } from "../constant"
import { generateUrlWithParams, requestPromise, requestPromiseWithLogin } from "../util"

export function fetchNotifyCount() {
  return requestPromiseWithLogin({
    method: 'POST',
    url: apiDomain + '/api/v1/notify/count'
  })
}

export function fetchNotifyList(params) {
  return requestPromiseWithLogin({
    method: 'POST',
    url: apiDomain + '/api/v1/notify',
    data: params
  })
}

export function readNotify(id) {
  return requestPromiseWithLogin({
    method: 'POST',
    url: apiDomain + '/api/v1/notify/read',
    data: { id }
  })
}