import { apiDomain } from "../constant";
import { requestPromise } from "../util";

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