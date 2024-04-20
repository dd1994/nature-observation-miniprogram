import { apiDomain } from "../constant"

const { requestPromise } = require('../util')

// 获取中国植物志内容
export function fetchPlantFrpsDetail({ name, success, fail }) {
  return requestPromise({
    url: apiDomain + '/api/v1/getfrpsContent',
    method: 'POST',
    data: { name },
    success(res) {
      success(res)
    },
    fail(err) {
      fail(err)
    }
  })
}

export function fetchPlantFrpsPhoto({ appphoto }) {
  return requestPromise({
    url: 'https://www.iplant.cn/ashx/getppbcphoto.ashx',
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: { appphoto, n: 1 }
  })
}

// 获取 Flora of China 中文翻译版
export function fetchPlantFocnDetail({ name, success, fail }) {
  return requestPromise({
    url: apiDomain + '/api/v1/getfrpsContent',
    method: 'POST',
    data: {
      name,
      lang: 'en'
    },
    success(res) {
      success(res)
    },
    fail(err) {
      fail(err)
    }
  })
}

export function fetchAnimalFaunaDetail({ name }) {
  return requestPromise({
    url: apiDomain + '/api/v1/taxon/animalFaunaDetail',
    method: 'post',
    data: {
      name,
    }
  })
}