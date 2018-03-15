<template>
  <scroll class="suggest" :data="result" :pullUp="pullUp" @scrollEnd="loadMore" @beforeScroll="beforeScroll">
    <ul class="suggest-list">
      <li v-for="(item, i) in result" :key="i" class="suggest-item" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="showTitle(item, i)"></p>
        </div>
      </li>
      <loading v-if="loadingShow"></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import scroll from '@/base/scroll/scroll'
import {searchKey} from 'api/searchKey'
import Singer from 'common/js/singer'
import loading from '@/base/loading/loading'
import noResult from '@/base/no-result/no-result'
import {createSong} from 'common/js/song'
import {mapMutations, mapActions} from 'vuex'
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
    scroll,
    loading,
    'no-result': noResult
  },
  data() {
    return {
      curPage: 1,
      singer: {},
      result: [],
      pullUp: true,
      totalNum: 0,
      hasMore: true,
      loadingShow: true
    }
  },
  computed: {
  },
  methods: {
    beforeScroll() {
      this.$emit('listScroll')
    },
    selectItem(item) {
      console.log(item)
      // 选择歌手
      if (item.type === 2) {
        this.$router.push({
          path: `/search/${item.id}`
        })
        this.setSinger(item)
      } else {
        // 选择歌曲
        this.insertSong({
          song: item
        })
      }
    },
    loadMore() {
      // console.log(this.totalNum)
      if (!this.hasMore) {
        this.loadingShow = false
        return
      }
      this.loadingShow = true
      if (this.curPage * PER_PAGE < this.totalNum) {
        this.searchStart()
      } else {
        this.hasMore = false
      }
      this.curPage++
    },
    getIconCls(item) {
      if (item.type === SINGER_FLAG) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    showTitle(item) {
      if (item.type === SINGER_FLAG) {
        return item.name
      } else {
        return `${item.singer}-${item.name}`
      }
    },
    searchStart() {
      searchKey(this.query, PER_PAGE, this.curPage).then((data) => {
        let _res = data.data.data
        if (_res.song.totalnum === 0) {
          this.hasMore = false
          return
        }
        this.totalNum = _res.song.totalnum
        this.getResult(_res).then((data) => {
          this.result = this.result.concat(data)
        })
        this.loadingShow = false
      })
    },
    getResult(data) {
      return new Promise((resolve) => {
        let _ret = []
        if (data.zhida && data.zhida.singerid) {
          let _singer = new Singer(data.zhida.singermid, data.zhida.singername)
          Object.assign(_singer, {type: SINGER_FLAG})
          _ret.push(_singer)
        }
        if (data.song) {
          this._normallizeSong(data.song.list).then((newSongs) => {
            _ret = _ret.concat(newSongs)
            resolve(_ret)
          })
        }
      })
    },
    _normallizeSong(songs) {
      return new Promise((resolve) => {
        let _newSongList = []
        songs.forEach((item, i) => {
          createSong(item).then((song) => {
            _newSongList.push(song)
            if (i === songs.length - 1) {
              resolve(_newSongList)
            }
          })
        })
      })
    },
    ...mapMutations(
      {'setSinger': 'SET_SINGER'}
    ),
    ...mapActions({
      insertSong: 'insertSong'
    })
  },
  watch: {
    query(newVal) {
      this.result = []
      this.hasMore = true
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