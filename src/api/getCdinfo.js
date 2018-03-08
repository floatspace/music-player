import {commonParams} from 'api/config'
import axios from 'axios'

export function getCdinfo(disstid) {
  let url = '/api/getCdinfo'
  let _params = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid: disstid,
    format: 'jsonp',
    jsonpCallback: 'playlistinfoCallback',
    loginUin: '0',
    hostUin: '0',
    platform: 'yqq',
    needNewCode: 0
  })
  return axios.get(url, {
    params: _params
  })
}