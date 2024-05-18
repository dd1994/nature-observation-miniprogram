import { apiDomain } from "../constant"
import { generateUrlWithParams, requestPromise, requestPromiseWithLogin } from "../util"

export function fetchIdentificationList(params) {
  return requestPromise({
    method: 'POST',
    url: apiDomain + '/api/v1/identifications',
    data: params
  })
}

export function fetchIndexIdList({ pageIndex, pageSize, user_id, q }: { pageIndex: number, pageSize: number, user_id?: string, q?: any }) {
  return requestPromiseWithLogin({
    url: apiDomain + '/api/v1/index-id',
    method: 'POST',
    data: {
      pageIndex,
      pageSize,
      user_id,
      q
    }
  })
}

export function createIdentification(params) {
  return requestPromiseWithLogin({
    url: apiDomain + '/api/v1/identifications/create',
    method: 'POST',
    data: params
  })
}