import { apiDomain } from "../constant";
import { requestPromiseWithLogin } from "../util";

export function getUserProfile() {
  return requestPromiseWithLogin({
    url: apiDomain + '/api/v1/user/getUserProfile',
    method: 'POST',
  })
}

export function updateUserProfile(params: any) {
  return requestPromiseWithLogin({
    url: apiDomain + '/api/v1/user/updateUserProfile',
    method: 'POST',
    data: params
  })
}