import { apiDomain } from "../constant";
import { requestPromise } from "../util";

export function fetchCustomFieldConfig(applicableTaxon) {
  return requestPromise({
    method: 'POST',
    url: apiDomain + '/api/v1/custom-field',
    data: { applicableTaxon }
  })
}