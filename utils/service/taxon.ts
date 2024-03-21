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

export function fetchTaxonList({ pageIndex, pageSize, needLogin = true }: { pageIndex: number, pageSize: number, needLogin?: boolean }) {
  const fn = needLogin ? requestPromiseWithLogin : requestPromise
  return fn({
    url: apiDomain + (needLogin ? '/api/v1/taxon' : '/api/v1/taxon-explore'),
    method: 'POST',
    data: {
      pageIndex,
      pageSize,
    }
  })
}

