<template>
  <transition name="slide">
    <MusicList :title="singer.name" :bgImg="avatar" :songs="songs"></MusicList>
  </transition>
</template>
<script>
import {mapGetters} from 'vuex'
import getSongs from 'api/getSongs'
import {ERROR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import MusicList from '@/components/music-list/music-list'

export default {
  components: {
    MusicList: MusicList
  },
  data() {
    return {
      songs: []
    }
  },
  computed: {
    avatar() {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  created() {
    this._getSingerSongs()
  },
  methods: {
    _getSingerSongs() {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSongs(this.singer.id).then((res) => {
        if (res.code === ERROR_OK) {
          this._normallizeSongs(res.data.list).then((data) => {
            this.songs = data
            console.log(this.songs)
          })
        }
      })
    },
    _normallizeSongs(songs) {
      return new Promise((resolve) => {
        let res = []
        songs.forEach((song, i) => {
          createSong(song.musicData).then((data) => {
            res.push(data)
            if (i === songs.length - 1) {
              resolve(res)
            }
          })
        })
      })
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>