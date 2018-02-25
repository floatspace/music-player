import getSongUrl from 'api/getSongUrl'
import {ERROR_OK} from 'api/config'
export default class Song {
  constructor ({id, mid, name, img, album, duration, singer, url}) {
    this.id = id
    this.mid = mid
    this.name = name
    this.img = img
    this.album = album
    this.singer = singer
    this.url = url
  }
}

function _songUrlFormat(urlData) {
  let _data = urlData.data.items[0]
  let preUrl = 'http://dl.stream.qqmusic.qq.com/'
  let endUrl = '&guid=7560145560&uin=0&fromtag=66'
  return `${preUrl}${_data.filename}?vkey=${_data.vkey}${endUrl}`
}

export function createSong(musicData) {
  return new Promise((resolve, reject) => {
    getSongUrl(musicData.songmid).then((res) => {
      if (res.code === ERROR_OK) {
        let _res = _songUrlFormat(res)
        resolve(new Song({
          id: musicData.songid,
          mid: musicData.songmid,
          name: musicData.songname,
          img: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
          album: musicData.albumname,
          duration: musicData.interval,
          singer: filterSinger(musicData.singer),
          url: _res
        }))
      }
    }).catch((err) => {
      console.log(err)
    })
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}