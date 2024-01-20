import { requestPromise } from "../util"

export const searchTaxon = ({ name }) => {
  return requestPromise({
    url: 'https://api.inaturalist.org/v1/taxa/autocomplete',
    data: {
      q: name,
      locale: 'zh-CN',
      preferred_place_id: 6903,
      per_page: 30
    }
  })
}