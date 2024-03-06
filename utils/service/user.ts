import { apiDomain } from "../constant";
import { requestPromise, requestPromiseWithLogin } from "../util";

export function getUserProfile() {
  return requestPromiseWithLogin({
    url: apiDomain + '/api/v1/user/getUserProfile',
    method: 'POST',
  })
}

export function getUserStatCount() {
  return requestPromiseWithLogin({
    url: apiDomain + '/api/v1/user/getStatCount',
    method: 'POST',
  })
}

export function getUserStatCountWithoutLogin({ user_id }: { user_id: string }) {
  return requestPromise({
    url: apiDomain + '/api/v1/user/getStatCount',
    method: 'POST',
    data: { user_id }
  })
}

export function updateUserProfile(params: any) {
  return requestPromiseWithLogin({
    url: apiDomain + '/api/v1/user/updateUserProfile',
    method: 'POST',
    data: params
  })
}

export const getUserAvatarUrl = (uuid) => {
  return 'https://nature-observation-user-avatar.oss-cn-beijing.aliyuncs.com/' + uuid
}