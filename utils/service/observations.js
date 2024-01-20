import { requestPromise, requestPromiseWithLogin } from "../util"

export function fetchObservationList() {
  return requestPromiseWithLogin({
    url: 'http://192.168.3.40:7001/api/v1/observations',
    method: 'POST',
  })
}

export function createObservation(params) {
  return requestPromiseWithLogin({
    url: 'http://192.168.3.40:7001/api/v1/observations/create',
    method: 'POST',
    data: params
  })
}

export function fetchObservationDetail(id) {
  return requestPromise({
    url: 'http://192.168.3.40:7001/api/v1/observations/' + id,
    method: 'POST',
  })
}

export function updateObservation(params, id) {
  return requestPromiseWithLogin({
    url: 'http://192.168.3.40:7001/api/v1/observations/update/' + id,
    method: 'post',
    data: params
  })
}

export function deleteObservation(id) {
  return requestPromiseWithLogin({
    url: 'http://192.168.3.40:7001/api/v1/observations/delete/' + id,
    method: 'post',
  })
}