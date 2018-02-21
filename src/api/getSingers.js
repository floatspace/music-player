import {commonParams} from 'api/config'
import jsonp from 'common/js/jsonp'

export function getSingers() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  let _data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    format: 'jsonp',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return jsonp(url, _data, {
    param: 'jsonpCallback'
  })
}