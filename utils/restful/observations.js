import { requestPromise } from "../util"

export function fetchObservationList() {
  return requestPromise({
    url: 'http://192.168.3.40:7001/api/v1/observations'
  })
}

export function fetchObservationDetail(id) {
  return requestPromise({
    url: 'http://192.168.3.40:7001/api/v1/observations/' + id,
  })
}

export function deleteObservation(id) {
  return requestPromise({
    url: 'http://192.168.3.40:7001/api/v1/observations/' + id,
    method: 'DELETE',
  })
}