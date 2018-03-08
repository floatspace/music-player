<template>
  <div class="search">
    <div class="search-box-wrapper">
      <searchbox @search="searchHandler" ref="searchBox"></searchbox>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-if="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li v-for="(item, i) in hotKeys" :key="i" class="item">
              <span @click="searchHot" v-html="item.k"></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest :query="query" :showSinger="showSinger"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import searchbox from '@/base/searchbox/searchbox'
import searchList from '@/base/search-list/search-list'
import suggest from '@/components/suggest/suggest'
import {getHotKey} from 'api/searchKey'

export default {
  components: {
    searchbox,
    searchList,
    suggest
  },
  data() {
    return {
      query: '',
      showSinger: true,
      hotKeys: []
    }
  },
  created() {
    this._getHotKey()
  },
  methods: {
    searchHandler(query) {
      this.query = query
    },
    searchHot(event) {
      const hotKey = event.target.innerHTML
      this.query = hotKey
      this.$refs.searchBox.setVal(hotKey)
    },
    _getHotKey() {
      getHotKey().then((data) => {
        this.hotKeys = data.data.data.hotkey.slice(0, 9)
      })
    }
  },
  watch: {
    query(newVal) {
      if (!newVal) {
        return false
      }
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>