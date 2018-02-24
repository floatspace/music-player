import {commonParams} from 'api/config'
import jsonp from 'common/js/jsonp'

export default function getSongs(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  let _data = Object.assign({}, commonParams, {
    format: 'jsonp',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    singermid: singerId,
    order: 'listen',
    begin: 0,
    num: 30,
    songstatus: 1
  })
  return jsonp(url, _data, {
    param: 'jsonpCallback'
  })
}