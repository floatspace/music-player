import axios from 'axios'

export function getRank() {
  const url = '/api/getRank'
  return axios.get(url)
}

export function getTopList(topid) {
  let url = '/api/getTopList'
  return axios.get(url, {
    params: {
      topid: topid
    }
  })
}