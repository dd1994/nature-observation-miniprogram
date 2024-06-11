import { apiDomain } from "../constant";
import { requestPromise, requestPromiseWithLogin } from "../util";

export function fetchCustomFieldConfig(taxon_id) {
  return requestPromise({
    method: 'POST',
    url: apiDomain + '/api/v1/get-custom-field-config',
    data: { taxon_id }
  })
}

export function fetchCustomFieldValue(observation_id) {
  return requestPromise({
    method: 'POST',
    url: apiDomain + '/api/v1/get-custom-field-value',
    data: { observation_id }
  })
}

export function fetchCustomFieldValueHistory(observation_id) {
  return requestPromise({
    method: 'POST',
    url: apiDomain + '/api/v1/get-custom-field-value-history',
    data: { observation_id }
  })
}

export function removeCustomFieldValue(observationId, configId) {
  return requestPromiseWithLogin({
    method: 'POST',
    url: apiDomain + '/api/v1/remove-custom-field-value',
    data: { observationId, configId }
  })
}

export function updateCustomFieldValue(params) {
  return requestPromiseWithLogin({
    method: 'POST',
    url: apiDomain + '/api/v1/update-custom-field-value',
    data: params
  })
}