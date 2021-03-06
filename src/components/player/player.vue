<template>
  <div class="player" v-if="playList.length > 0">
    <transition name="normal" @enter="enter" @after-enter="afterEnter">
      <div class="normal-player" v-if="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.img" alt="">
        </div>
        <div class="top">
          <div class="back">
            <i class="icon-back" @click="toggleFullScreen(false)"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd">
                <img :class="cdImgCls" :src="currentSong.img" alt="">
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <ProgressBar :percent="percent" @progressBarChange="progressBarChange"></ProgressBar>
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i @click="changeMode" :class="modeCls"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="iconPlayCls"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-if="!fullScreen" @click="toggleFullScreen(true)">
        <div class="icon">
          <img width="40" height="40" :class="cdImgMiniCls" :src="currentSong.img" alt="">
        </div>
        <div class="text">
          <div class="name" v-html="currentSong.name"></div>
          <div class="desc"></div>
        </div>
        <div class="control">
          <ProgressCircle :radius="radius" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="iconPlayMiniCls"></i>
          </ProgressCircle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio :src="currentSong.url" ref="audio"
      @canplay="readyPlay"
      @error="songError"
      @timeupdate="updateTime"
      @ended="songEnd"
    >
    </audio>
  </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex'
import createAnimations from 'create-keyframe-animation'
import ProgressBar from '@/components/progress-bar/progress-bar'
import ProgressCircle from '@/base/progress-circle/progress-circle'
import {playMode} from 'common/js/config'
import * as Util from 'common/js/util'
export default {
  components: {
    ProgressBar,
    ProgressCircle
  },
  data() {
    return {
      songReady: false,
      currentTime: 0,
      radius: 32
    }
  },
  computed: {
    iconPlayCls() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    iconPlayMiniCls() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdImgCls() {
      return this.playing ? 'image play' : 'image play pause'
    },
    cdImgMiniCls() {
      return this.playing ? 'play' : 'play pause'
    },
    disableCls() {
      return this.songReady ? '' : 'disable'
    },
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    modeCls() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.random ? 'icon-random' : 'icon-loop'
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'sequenceList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode'
    ])
  },
  methods: {
    songEnd() {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    changeMode() {
      let _mode = (this.mode + 1) % 3
      this.setMode(_mode)
      let newPlayList = null
      if (_mode === playMode.random) {
        newPlayList = Util.shuffle(this.playList)
      } else if (_mode === playMode.sequence) {
        newPlayList = this.sequenceList
      } else {
        let _list = []
        _list.push(this.currentSong)
        newPlayList = _list
      }
      this._resetCurrentSongIndex(newPlayList)
      this.setPlayList(newPlayList)
    },
    _resetCurrentSongIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    readyPlay() {
      // 歌曲url加载完毕时，添加songReady标记为true
      this.songReady = true
    },
    songError() {
      this.songReady = true
    },
    enter(el, done) {
      createAnimations.registerAnimation({
        name: 'cdMove',
        animation: {
          0: {transform: `translate3d(-100px, 300px, 0) scale(0.2)`},
          60: {transform: `translate3d(0, 0, 0) scale(1.2)`},
          100: {transform: `translate3d(0, 0, 0) scale(1)`}
        },
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      createAnimations.runAnimation(this.$refs.cdWrapper, 'cdMove', done)
    },
    afterEnter(el) {
      createAnimations.unregisterAnimation('cdMove')
      this.$refs.cdWrapper.animation = ''
    },
    toggleFullScreen(flag) {
      this.setFullScreen(flag)
    },
    togglePlaying() {
      this.setPlayingState(!this.playing)
    },
    prev() {
      if (!this.songReady) {
        return
      }
      let curIndex = -1
      if (this.playList.length === 1) {
        this.loop()
      } else {
        curIndex = this.currentIndex - 1
        if (curIndex === -1) {
          curIndex = this.playList.length - 1
        }
        this.setCurrentIndex(curIndex)
        this.songReady = false
      }
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    next() {
      if (!this.songReady) {
        return
      }
      let curIndex = -1
      if (this.playList.length === 1) {
        this.loop()
      } else {
        curIndex = this.currentIndex + 1
        if (curIndex === this.playList.length) {
          curIndex = 0
        }
        this.setCurrentIndex(curIndex)
        this.songReady = false
      }
      // 播放图标显示状态
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime
    },
    formatTime(time) {
      let minuse = time / 60 | 0
      let seconds = this._pad(time % 60 | 0)
      return `${minuse}:${seconds}`
    },
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    progressBarChange(percent) {
      this.$refs.audio.currentTime = this.currentSong.duration * percent
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    ...mapMutations({
      'setFullScreen': 'SET_FULL_SCREEN',
      'setPlayingState': 'SET_PLAYING_STATE',
      'setCurrentIndex': 'SET_CURRENT_INDEX',
      'setMode': 'SET_MODE',
      'setPlayList': 'SET_PLAYLIST'
    })
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (newSong && oldSong && newSong.id === oldSong.id) {
        return
      }
      setTimeout(() => {
        this.$refs.audio.play()
      }, 20)
    },
    playing(newVal) {
      let audio = this.$refs.audio
      setTimeout(() => {
        newVal ? audio && audio.play() : audio.pause()
      }, 20)
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"
  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            box-sizing: border-box
            .cd
              width: 100%
              height: 100%
              border-radius: 50%
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border: 10px solid rgba(255, 255, 255, 0.1)
                box-sizing: border-box
                border-radius: 50%
                &.play
                  animation: rotate 20s linear infinite
                &.pause
                  animation-play-state: paused
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0
      @keyframes rotate
        0%
          transform: rotate(0deg)
        100%
          transform : rotate(360deg)
</style>