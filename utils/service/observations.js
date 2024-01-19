import { requestPromise, requestPromiseWithLogin } from "../util"

export function fetchObservationList() {
  return requestPromiseWithLogin({
    url: 'http://192.168.3.40:7001/api/v1/observations'
  })
}

export function createObservation(params) {
  return requestPromiseWithLogin({
    url: 'http://192.168.3.40:7001/api/v1/observations',
    method: 'POST',
    data: params
  })
}

export function fetchObservationDetail(id) {
  return requestPromise({
    url: 'http://192.168.3.40:7001/api/v1/observations/' + id,
  })
}

export function updateObservation(params, id) {
  return requestPromise({
    url: 'http://192.168.3.40:7001/api/v1/observations/' + id,
    method: 'put',
    data: params
  })
}

export function deleteObservation(id) {
  return requestPromise({
    url: 'http://192.168.3.40:7001/api/v1/observations/' + id,
    method: 'DELETE',
  })
}