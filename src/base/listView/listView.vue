<template>
  <Scroll :data="data" :listenScroll="listenScroll" :probeType="probeType" @scroll="scroll" class="listview" ref="listview">
    <ul class="list">
      <li class="list-group" v-for="(group,i) in data" :key="i" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="singerHandler(item)" class="list-group-item" v-for="(item, k) in group.items" :key="k">
            <img class="avatar" v-lazy="item.avatar" alt="">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, i) in shortcutList" :key="i" class="item" :data-index="i" :class="{'current': curIndex===i}">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}} </div>
    </div>
    <div class="loading-container" v-if="!data.length">
      <Loading></Loading>
    </div>
  </Scroll>
</template>
<script>
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import {getElAttr} from 'common/js/dom'

const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30

export default {
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {
    Scroll: Scroll,
    Loading: Loading
  },
  data() {
    return {
      listenScroll: true,
      probeType: 3,
      listHeight: [],
      scrollY: 0,
      curIndex: 0,
      diff: 0
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    singerHandler(singerData) {
      this.$emit('selectSinger', singerData)
    },
    onShortcutTouchStart(e) {
      let anchorIndex = getElAttr(e.target, 'index')
      // 空白区域过滤
      if (!anchorIndex && anchorIndex !== 0) {
        return
      }
      this.touch.y1 = e.touches[0].pageY
      this.touch.firstIndex = anchorIndex
      this._scrollToEl(anchorIndex)
      // 更新当前索引值
      this.curIndex = parseInt(anchorIndex)
    },
    onShortcutTouchMove(e) {
      this.touch.y2 = e.touches[0].pageY
      let disIndex = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let desIndex = parseInt(this.touch.firstIndex) + disIndex
      this._scrollToEl(desIndex)
      // 更新当前索引值
      this.curIndex = parseInt(desIndex)
      if (this.curIndex < 0) {
        this.curIndex = 0
      } else if (this.curIndex > this.listHeight.length - 2) {
        this.curIndex = this.listHeight.length - 2
      }
    },
    scroll(pos) {
      /* 列表滚动与右侧索引级联原理：
       * 1.scroll组件滚动时设置派发scroll事件，获取其实时滚动位置pos
       * 2.动态计算出列表中各个区块的高度（实际高度需累加）集合，第一个设置为0
       * 3.通过遍历计算出的高度集合，比较高度区间，得出当前索引值
       * 4.当前索引值改变后，右侧高亮状态同步更新
      */
      let listHeight = this.listHeight
      let newY = pos.y
      this.scrollY = pos.y
      // 滚动到顶部，newY>0
      if (newY > 0) {
        this.curIndex = 0
        return
      }
      // 中间滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.curIndex = i
          this.diff = height2 + newY
          return
        }
        this.curIndex = 0
      }
      // 滚动到底部，-newY大于最后一个元素的上限
      this.curIndex = listHeight.length - 2
    },
    _scrollToEl(index) {
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calListHeight() {
      let firstHeight = 0
      this.listHeight.push(firstHeight)
      let listGrop = this.$refs.listGroup
      listGrop.forEach((item) => {
        firstHeight += item.clientHeight
        this.listHeight.push(firstHeight)
      })
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calListHeight()
      }, 20)
    },
    diff(newDiff) {
      let fixedTop = (newDiff > 0 && newDiff < TITLE_HEIGHT) ? newDiff - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.curIndex] ? this.data[this.curIndex].title : ''
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>