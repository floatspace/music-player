<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" cx="50" cy="50" r="50" fill="transparent"/>
      <circle class="progress-bar" cx="50" cy="50" r="50" fill="transparent"
        :stroke-dasharray="totalDash"
        :stroke-dashoffset="dashOffset"/>
    </svg>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    percent: {
      type: Number,
      default: 0.5
    },
    radius: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      totalDash: Math.PI * 100
    }
  },
  computed: {
    dashOffset() {
      return this.totalDash * (1 - this.percent)
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '../../common/stylus/variable'
  .progress-circle
    position: relative
    circle
      stroke-width: 8px
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        stroke: $color-theme-d
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme
</style>