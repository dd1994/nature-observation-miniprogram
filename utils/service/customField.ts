import { apiDomain } from "../constant";
import { requestPromise } from "../util";

export function fetchCustomFieldConfig(ancestor_ids) {
  return requestPromise({
    method: 'POST',
    url: apiDomain + '/api/v1/custom-field',
    data: { ancestor_ids }
  })
}