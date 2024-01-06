import { apiDomain } from "../constant"
import { generateUrlWithParams, requestPromise } from "../util"

export const fetchTaxonTreeFromSp2000 = ({ rank, name }) => {
  return requestPromise({
    url: generateUrlWithParams(apiDomain + '/api/v1/taxon', { rank, name })
  })
}