<template>
  <transition name="slide">
    <MusicList :bgImg="bgImg" :title="topTitle" :songs="songs"></MusicList>
  </transition>
</template>
<script>
import {mapGetters} from 'vuex'
import MusicList from '@/components/music-list/music-list'
import {getTopList} from 'api/getRank'
import {ERROR_OK} from 'api/config'
import {createSong} from '@/common/js/song'
export default {
  components: {
    MusicList: MusicList
  },
  data() {
    return {
      songs: []
    }
  },
  created() {
    this._getToplist()
  },
  methods: {
    _getToplist() {
      getTopList(this.topinfo.id).then((data) => {
        let _data = data.data
        if (_data.code === ERROR_OK) {
          let res = _data.songlist.splice(0, 30)
          this.songs = this._normallizeSong(res)
        }
      })
    },
    _normallizeSong(songList) {
      let res = []
      songList.forEach((song) => {
        createSong(song.data).then((data) => {
          res.push(data)
        })
      })
      return res
    }
  },
  computed: {
    bgImg() {
      return this.songs.length ? this.songs[0].img : ''
    },
    topTitle() {
      return this.topinfo.topTitle
    },
    ...mapGetters([
      'topinfo'
    ])
  }
}
</script>
<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition: all 0.5s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>