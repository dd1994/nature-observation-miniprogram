const { requestPromise } = require('./util')

// 获取中国植物志内容
export function fetchPlantFrpsDetail({ name, success, fail }) {
  return requestPromise({
    url: 'https://www.iplant.cn/ashx/getfrps.ashx',
    data: {
      key: name
    },
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
    data: { appphoto, n: 1 }
  })
}

// 获取 Flora of China 中文翻译版
export function fetchPlantFocnDetail({ name, success, fail }) {
  return requestPromise({
    url: 'https://www.iplant.cn/ashx/getfocn.ashx',
    data: {
      key: name
    },
    success(res) {
      success(res)
    },
    fail(err) {
      fail(err)
    }
  })
}


function fetchAnimalDetailDescType(name) {
  return requestPromise({
    url: 'http://zoology.especies.cn/api/v1/descriptionType',
    data: {
      apiKey: '546ce270795d4acc8a61b0f06a72daa7',
      scientificName: name,
      dbaseName: '中国动物志数据库'
    }
  }).then(res => {
    if (res?.data?.code === 200) {
      return res?.data?.data?.desType
    } else {
      throw new Error(res?.data?.message)
    }
  })
}

function fetchAnimalDetailDesc(name, descType) {
  const descTypeKey = Object.keys(descType)[0]
  const descTypeChinese = descType[descTypeKey]

  return requestPromise({
    url: 'http://zoology.especies.cn/api/v1/description',
    data: {
      apiKey: '546ce270795d4acc8a61b0f06a72daa7',
      scientificName: name,
      dbaseName: '中国动物志数据库',
      descriptionType: descTypeKey
    }
  }).then(res => {
    if (res?.data?.code === 200) {
      return {
        ...res.data.data,
        descTypeKey: descTypeKey,
        descTypeChinese: descTypeChinese
      }
    } else {
      throw new Error(res?.data?.message)
    }
  })
}
export function fetchAnimalDetail({ name }) {
  return fetchAnimalDetailDescType(name)
    .then(descTypes => {
      return Promise.all(descTypes
        .map(descType => {
          return fetchAnimalDetailDesc(name, descType)
        }))
    })
}