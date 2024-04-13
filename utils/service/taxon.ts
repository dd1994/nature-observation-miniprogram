import { apiDomain } from "../constant"
import { generateUrlWithParams, requestPromise, requestPromiseWithLogin } from "../util"

export const fetchTaxonTree = ({ rank, name, id }) => {
  return requestPromise({
    url: apiDomain + '/api/v1/taxon/tree',
    method: 'POST',
    data: {
      rank, name, id
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

export function fetchTaxonList({ pageIndex, pageSize, needLogin = true, user_id }: { pageIndex: number, pageSize: number, needLogin?: boolean, user_id?: string }) {
  const fn = needLogin ? requestPromiseWithLogin : requestPromise
  return fn({
    url: apiDomain + (needLogin ? '/api/v1/taxon' : '/api/v1/taxon-explore'),
    method: 'POST',
    data: {
      pageIndex,
      pageSize,
      user_id
    }
  })
}

