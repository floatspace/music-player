<template>
  <transition name="slide">
    <MusicList :bgImg="bgImg" :title="discName" :songs="songs"></MusicList>
  </transition>
</template>
<script>
import {mapGetters} from 'vuex'
import MusicList from '@/components/music-list/music-list'
import {getCdinfo} from 'api/getCdinfo'
import {ERROR_OK} from 'api/config'
import {createSong} from '@/common/js/song'
export default {
  props: {
    dissId: {
      type: String,
      default: ''
    }
  },
  components: {
    MusicList: MusicList
  },
  data() {
    return {
      songs: []
    }
  },
  created() {
    this._getDisc()
  },
  methods: {
    _getDisc() {
      getCdinfo(this.disc.dissid).then((data) => {
        let _data = data.data
        if (_data.code === ERROR_OK) {
          this.songs = this._normallizeSong(_data.cdlist[0].songlist)
          console.log(this.songs)
        }
      })
    },
    _normallizeSong(songList) {
      let res = []
      songList.forEach((song) => {
        createSong(song).then((data) => {
          res.push(data)
        })
      })
      return res
    }
  },
  computed: {
    bgImg() {
      return this.disc.imgurl
    },
    discName() {
      return this.disc.dissname
    },
    ...mapGetters([
      'disc'
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