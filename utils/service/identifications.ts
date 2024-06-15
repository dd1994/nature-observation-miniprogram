import { apiDomain } from "../constant"
import { generateUrlWithParams, requestPromise, requestPromiseWithLogin } from "../util"

export function fetchIdentificationList(params) {
  return requestPromise({
    method: 'POST',
    url: apiDomain + '/api/v1/identifications',
    data: params
  })
}

export function fetchIndexIdList({ pageIndex, pageSize, user_id, needLogin, q }: { pageIndex: number, pageSize: number, user_id?: string, needLogin: boolean, q?: any }) {
  const fn = needLogin ? requestPromiseWithLogin : requestPromise
  return fn({
    url: apiDomain + (needLogin ? '/api/v1/index-id' : '/api/v1/user-home-id'),
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