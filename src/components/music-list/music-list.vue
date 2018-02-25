<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-img" :style="bgStyle" ref="bgImg">
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <Scroll :data="songs" :probeType="3" :listenScroll="true" @scroll="scrollEvent" class="list" ref="list">
      <div class="song-list-wrapper">
        <SongList :songs="songs"></SongList>
      </div>
      <div class="loading-container" v-if="!songs.length">
        <Loading></Loading>
      </div>
    </Scroll>
  </div>
</template>
<script>
import Scroll from '@/base/scroll/scroll'
import SongList from '@/components/song-list/song-list'
import Loading from '@/base/loading/loading'
import {prefixStyle} from 'common/js/dom'
const TITLE_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')
export default {
  components: {
    Scroll,
    SongList,
    Loading
  },
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    bgImg: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      scrollY: 0
    }
  },
  mounted() {
    this.imgHeight = this.$refs.bgImg.clientHeight
    this.minTranslateY = this.imgHeight - TITLE_HEIGHT
    this.$refs.list.$el.style.top = `${this.imgHeight}px`
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImg})`
    }
  },
  methods: {
    back() {
      this.$router.back()
    },
    scrollEvent(pos) {
      this.scrollY = pos.y
    }
  },
  watch: {
    scrollY(newY) {
      let layer = this.$refs.layer
      let bgImg = this.$refs.bgImg
      let zIndex = 0
      let scale = 1
      let blur = 0
      let translateY = Math.min(-newY, this.minTranslateY)
      // 设置遮罩层偏移
      layer.style[transform] = `translate3d(0, ${-translateY}px, 0)`
      // 极限条件（到达指定滚动距离时）
      if (-newY > this.minTranslateY) {
        zIndex = 10
        bgImg.style.paddingTop = 0
        bgImg.style.height = `${TITLE_HEIGHT}px`
      } else {
        zIndex = 0
        bgImg.style.paddingTop = '70%'
        bgImg.style.height = 0
      }
      // 计算下拉图片放大比例
      const percent = Math.abs(-newY / this.imgHeight)
      if (newY > 0) {
        scale = 1 + percent
        zIndex = 10
        bgImg.style[transform] = `scale(${scale})`
      } else {
        blur = Math.min(20 * percent, 20)
      }
      this.$refs.filter.style[backdrop] = `blur(${blur})`
      bgImg.style.zIndex = zIndex
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"
  .music-list
    position: fixed
    top: 0
    right: 0
    bottom: 0
    left: 0
    z-index: 100
    background-color: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-img
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>