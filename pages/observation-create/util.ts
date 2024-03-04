import moment from "moment"
import { defaultTimeFormat } from "../../utils/constant"

export const generateSaveParamsFromData = (data: any) => {
  const basicInfo = {
    description: data.description,
    observed_on: moment(data.observedOn, defaultTimeFormat).format('x'),
    captive_cultivated: data.captive_cultivated
  }
  const taxonInfo = {
    common_name: data.taxon.preferred_common_name,
    scientific_name: data.taxon.name,
    taxon_rank: data.taxon.rank,
    iconic_taxon_name: data.taxon.iconic_taxon_name,
    taxon_id: data.taxon.id
  }

  const otherInfo = {
  }

  const locationInfo = {
    'latitude': data.location?.latitude || null,
    'longitude': data.location?.longitude || null,
    'province': data.location?.province || null,
    'city': data.location?.city || null,
    'district': data.location?.district || null,
    "recommend_address_name": data.location?.recommend_address_name || null,
  }

  const params = {
    fileList: data.fileList,
    ...basicInfo,
    ...locationInfo,
    ...taxonInfo,
    ...otherInfo
  }


  if (data.isEdit) {
    // @ts-ignore
    params.taxonChanged = data.taxonChanged
  }
  return params
}

export const generateDataFromRes = (res) => {
  return {
    description: res.description,
    observedOn: moment(res.observed_on).format(defaultTimeFormat),
    "captive_cultivated": !!res.captive_cultivated,
    location: {
      "latitude": res.latitude,
      "longitude": res.longitude,
      "province": res.province,
      "city": res.city,
      "district": res.district,
      "recommend_address_name": res.recommend_address_name,
    },
    originTaxonName: res.scientific_name,
    taxon: {
      "preferred_common_name": res.common_name,
      "common_name": res.common_name,
      "name": res.scientific_name,
      "rank": res.taxon_rank,
      "iconic_taxon_name": res.iconic_taxon_name,
      "id": res.taxon_id,
    },
    fileList: res.photos.map(i => {
      return {
        url: i.url,
        key: i.key,
        type: 'image',
        status: 'done'
      }
    })
  }
}

// 选中文件之后，计算一个随机的短文件名
const getRandFileName = (filePath: string) => {
  const extIndex = filePath.lastIndexOf('.');
  const extName = extIndex === -1 ? '' : filePath.substr(extIndex);
  return parseInt(`${Date.now()}${Math.floor(Math.random() * 900 + 100)}`, 10).toString(36) + extName;
}

export const mapFileList = (file) => {
  return {
    "name": getRandFileName(file.tempFilePath),
    "fileType": "image",
    "url": file.tempFilePath,
    "size": file.size,
    "percent": 0
  }
}