import axios from 'axios'

export function searchKey(key, perPage, curPage) {
  const url = 'api/searchKey'
  return axios.get(url, {
    params: {
      w: encodeURIComponent(key),
      perPage: perPage,
      curPage: curPage
    }
  })
}

export function getHotKey() {
  const url = 'api/getHotKey'
  return axios.get(url)
}