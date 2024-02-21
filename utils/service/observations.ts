import { apiDomain } from "../constant"
import { requestPromise, requestPromiseWithLogin } from "../util"

export function fetchObservationList({ pageIndex, pageSize, q, needLogin = true }: { pageIndex: number, pageSize: number, q?: any, needLogin?: boolean }) {
  if (needLogin) {
    return requestPromiseWithLogin({
      url: apiDomain + '/api/v1/observations',
      method: 'POST',
      data: {
        pageIndex,
        pageSize,
        q
      }
    })
  } else {
    return requestPromise({
      url: apiDomain + '/api/v1/observations/explore',
      method: 'POST',
      data: {
        pageIndex,
        pageSize,
        q
      }
    })
  }
}

export function createObservation(params) {
  return requestPromiseWithLogin({
    url: apiDomain + '/api/v1/observations/create',
    method: 'POST',
    data: params
  })
}

export function fetchObservationDetail(id) {
  return requestPromise({
    url: apiDomain + '/api/v1/observations/' + id,
    method: 'POST',
  })
}

export function updateObservation(params, id) {
  return requestPromiseWithLogin({
    url: apiDomain + '/api/v1/observations/update/' + id,
    method: 'post',
    data: params
  })
}

export function deleteObservation(id) {
  return requestPromiseWithLogin({
    url: apiDomain + '/api/v1/observations/delete/' + id,
    method: 'post',
  })
}