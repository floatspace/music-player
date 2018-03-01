<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
        @touchstart.prevent="touchStart"
        @touchmove.prevent="touchMove"
        @touchend="touchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
const btnWidth = 16
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    touchStart(e) {
      this.touch.initialed = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    touchMove(e) {
      if (!this.touch) {
        return false
      }
      let detalX = e.touches[0].pageX - this.touch.startX
      let _offsetWidth = Math.min(Math.max(0, this.touch.left + detalX), this.$refs.progressBar.clientWidth - btnWidth)
      this._setOffset(_offsetWidth)
    },
    touchEnd() {
      this.touch.initialed = false
      this._triggerPercent()
    },
    progressClick(e) {
      // 通过e.offsetX方式获取点击位置到起点的位置，在点击proressBtn时会计算有误，改用e.pageX
      let startPos = this.$refs.progressBar.getBoundingClientRect().left
      let _offsetX = e.pageX - startPos
      this._setOffset(_offsetX)
      this._triggerPercent()
    },
    _setOffset(width) {
      this.$refs.progress.style.width = `${width}px`
      this.$refs.progressBtn.style['transform'] = `translate3d(${width}px, 0, 0)`
    },
    _triggerPercent() {
      let percent = this.$refs.progress.clientWidth / (this.$refs.progressBar.clientWidth - btnWidth)
      this.$emit('progressBarChange', percent)
    }
  },
  watch: {
    percent (newPer) {
      if (newPer > 0 && !this.touch.initialed) {
        let totalWidth = this.$refs.progressBar.clientWidth - btnWidth
        let curProgressWidth = totalWidth * newPer
        this.$refs.progress.style.width = `${curProgressWidth}px`
        this.$refs.progressBtn.style['transform'] = `translate3d(${curProgressWidth}px, 0, 0)`
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import "../../common/stylus/variable"
  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
