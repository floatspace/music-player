import jsonp from 'common/js/jsonp'
import {
  commonParams,
  options
} from 'api/config'
import axios from 'axios'

// 获取轮播图数据接口
export function getSlides() {
  let _params = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1,
    _: 1518407758645
  })
  return axios.get('/api/getSlides', {
    params: _params
  }).then(function (data) {
    return Promise.resolve(data)
  }).catch((e) => {
    console.log(e)
  })
}

// 获取推荐歌单列表数据接口
export function getRecommend() {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    loginUin: 0,
    hostUin: 0,
    needNewCode: 0,
    data: {
      'comm': {
        'ct': 24
      },
      'recomPlaylist': {
        'method': 'get_hot_recommend',
        'param': {
          'async': 1,
          'cmd': 2
        },
        'module': 'playlist.HotRecommendServer'
      }
    }
  })
  return jsonp(url, data, options)
}

// 获取全部歌单列表数据
export function getPlayList() {
  const url = '/api/getPlayList'
  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}