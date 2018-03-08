<template>
  <scroll class="suggest" :data="result">
    <ul class="suggest-list">
      <li v-for="(item, i) in result" :key="i" class="suggest-item">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="showTitle(item, i)"></p>
        </div>
      </li>
    </ul>
  </scroll>
</template>

<script type="text/ecmascript-6">
import scroll from '@/base/scroll/scroll'
import {searchKey} from 'api/searchKey'
const PER_PAGE = 20
const SINGER_FLAG = 2

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  components: {
    scroll
  },
  data() {
    return {
      curPage: 1,
      singer: {},
      result: []
    }
  },
  computed: {
  },
  methods: {
    getIconCls(item) {
      if (item.type === SINGER_FLAG) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    showTitle(item) {
      if (item.type === SINGER_FLAG) {
        return item.singername
      } else {
        return item.albumname
      }
    },
    searchStart() {
      searchKey(this.query, PER_PAGE, this.curPage).then((data) => {
        let _res = data.data.data
        this.result = _res.song.list
        this.showSinger && this.result.unshift(_res.zhida)
        console.log(this.result)
      })
    }
  },
  watch: {
    query(newVal) {
      this.searchStart()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>