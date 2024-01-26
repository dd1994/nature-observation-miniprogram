import moment from "moment"
import { defaultTimeFormat } from "../../utils/constant"

export const generateSaveParamsFromData = (data: any) => {
  const basicInfo = {
    description: data.description,
    observed_on: moment(data.observedOn, defaultTimeFormat).format('x'),
    artificial: data.artificial
  }
  const taxonInfo = {
    common_name: data.taxon.preferred_common_name,
    scientific_name: data.taxon.name,
    taxon_rank: data.taxon.rank,
    iconic_taxon_name: data.taxon.iconic_taxon_name,
    taxon_id: data.taxon.id
  }

  const otherInfo = {
    license: null
  }

  const locationInfo = {
    'latitude': data.location?.latitude || null,
    'longitude': data.location?.longitude || null,
    'province': data.location?.province || null,
    'city': data.location?.city || null,
    'district': data.location?.district || null,
    "recommend_address_name": data.location?.recommend_address_name || null,
    "standard_address": data.location?.standard_address || null,
  }

  const params = {
    fileList: data.fileList,
    ...basicInfo,
    ...locationInfo,
    ...taxonInfo,
    ...otherInfo
  }

  return params
}