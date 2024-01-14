import { generateUrlWithParams, requestPromise } from "../util"

export function fetchIdentificationList(params) {
  return requestPromise({
    url: generateUrlWithParams('http://192.168.3.40:7001/api/v1/identifications', params),
  })
}