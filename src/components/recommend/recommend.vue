<template>
  <div>
    <Scroll ref="scroll" :data="playList" class="recommend-content">
      <div>
        <div v-if="sliders.length" class="slider-wrapper">
          <Slider>
            <div v-for="(item, k) in sliders" :key="k">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" alt="">
              </a>
            </div>
          </Slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(item)" class="item" v-for="(item,index) in playList" :key="index">
              <div class="icon">
                <img @loadImg="loadImg" v-lazy="item.imgurl" width="60" height="60" alt="">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc">{{item.dissname}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-if="!playList.length">
        <Loading></Loading>
      </div>
    </Scroll>
    <router-view></router-view>
  </div>
</template>
<script>
import {mapMutations} from 'vuex'
import {getSlides, getPlayList} from 'api/getRecommend'
import {ERROR_OK} from 'api/config'
import Scroll from '@/base/scroll/scroll'
import Slider from '@/base/slider/slider'
import Loading from '@/base/loading/loading'
export default {
  components: {
    Scroll: Scroll,
    Slider: Slider,
    Loading: Loading
  },
  data() {
    return {
      sliders: [],
      playList: []
    }
  },
  created() {
    this._getSliders()
    this._getPlayList()
  },
  methods: {
    selectItem(item) {
      if (!item.dissid) {
        this.$router.push('/recommend')
        return
      }
      this.setDisc(item)
      this.$router.push('/recommend/' + item.dissid)
    },
    _getSliders() {
      let self = this
      getSlides().then(function(data) {
        let _data = data.data
        if (_data.code === ERROR_OK) {
          console.log(_data.data.slider)
          self.sliders = _data.data.slider
        }
      })
    },
    _getPlayList() {
      getPlayList().then((data) => {
        if (data.code === ERROR_OK) {
          console.log(data.data)
          this.playList = data.data.list
        }
      })
    },
    loadImg() { // 轮播图图片加载完毕后，刷新scroll插件（可能存在问题：轮播图接口数据比歌单数据慢的情况）
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  .recommend-content
    height: 100%
    overflow: hidden
    .slider-wrapper
      position: relative
      width: 100%
      overflow: hidden
    .recommend-list
      .list-title
        height: 65px
        line-height: 65px
        text-align: center
        font-size: $font-size-medium
        color: $color-theme
      .item
        display: flex
        box-sizing: border-box
        align-items: center
        padding: 0 20px 20px 20px
        .icon
          flex: 0 0 60px
          width: 60px
          padding-right: 20px
        .text
          display: flex
          flex-direction: column
          justify-content: center
          flex: 1
          line-height: 20px
          overflow: hidden
          font-size: $font-size-medium
          .name
            margin-bottom: 10px
            color: $color-text
          .desc
            color: $color-text-d
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>