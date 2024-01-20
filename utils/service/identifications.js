import { apiDomain } from "../constant"
import { generateUrlWithParams, requestPromise, requestPromiseWithLogin } from "../util"

export function fetchIdentificationList(params) {
  return requestPromise({
    method: 'POST',
    url: apiDomain + '/api/v1/identifications',
    data: params
  })
}

export function createIdentification(params) {
  return requestPromiseWithLogin({
    url: apiDomain + '/api/v1/identifications',
    method: 'POST',
    data: params
  })
}