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

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    name: musicData.songname,
    img: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    album: musicData.albumname,
    duration: musicData.interval,
    singer: filterSinger(musicData.singer),
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
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