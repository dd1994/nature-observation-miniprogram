import { apiDomain } from "../constant"
import { generateUrlWithParams, requestPromise, requestPromiseWithLogin } from "../util"

export const fetchTaxonTreeFromSp2000 = ({ rank, name }) => {
  return requestPromise({
    url: apiDomain + '/api/v1/taxon/tree',
    method: 'POST',
    data: {
      rank, name
    }
  })
}

export const searchTaxon = ({ name }) => {
  return requestPromise({
    url: apiDomain + '/api/v1/taxon/search',
    method: 'POST',
    data: {
      q: name
    }
  })
}

export function fetchTaxonList({ pageIndex, pageSize }: { pageIndex: number, pageSize: number }) {
  return requestPromiseWithLogin({
    url: apiDomain + '/api/v1/taxon',
    method: 'POST',
    data: {
      pageIndex,
      pageSize,
    }
  })
}

