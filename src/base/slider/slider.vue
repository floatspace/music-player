<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(dot, i) in dotsNum" :key="i" :class="{active: currentIndex === i}"></span>
    </div>
  </div>
</template>
<script>
import {addClass} from 'common/js/dom'
import BetterScroll from 'better-scroll'
export default {
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      dotsNum: 0,
      currentIndex: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 初始化轮播图总宽度
      this._initSliderWidth()
      // 初始化slider接口
      this._initSlider()
      if (this.autoPlay) {
        this._play()
      }
    })
    // 窗框改变时，重新计算宽度
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._initSliderWidth(true)
      this.slider.refresh()
    })
  },
  activated() { // 组件激活时调用
    if (this.autoPlay) {
      this._play()
    }
  },
  deactivated() { // 组件停用时调用
    clearTimeout(this.timer)
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  methods: {
    // 初始化slider的宽度
    _initSliderWidth(isResize) {
      this.childrens = this.$refs.sliderGroup.children
      let totalWidth = 0
      let singleWidth = this.$refs.slider.clientWidth
      // 初始化dot数量
      this.dotsNum = this.childrens.length
      for (let i = 0; i < this.childrens.length; i++) {
        let curEl = this.childrens[i]
        addClass(curEl, 'slider-item')
        curEl.style.width = singleWidth + 'px'
        totalWidth += singleWidth
      }
      // 设置无缝滚动宽度
      if (this.loop && !isResize) {
        totalWidth += singleWidth * 2
      }
      this.$refs.sliderGroup.style.width = totalWidth + 'px'
    },
    // 初始化slider滚动
    _initSlider() {
      this.slider = new BetterScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.1,
          speed: 400
        }
      })
      // 幻灯片切换时更新当前索引
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        this.currentIndex = pageIndex
        if (this.loop) {
          clearTimeout(this.timer)
          this._play()
        }
      })

      this.slider.on('beforeScrollStart', () => {
        if (this.autoPlay) {
          clearTimeout(this.timer)
        }
      })
    },
    _play() {
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>