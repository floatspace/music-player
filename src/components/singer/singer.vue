<template>
  <div class="singer">
    <ListView :data="singers"></ListView>
  </div>
</template>
<script>
import {getSingers} from 'api/getSingers'
import Singer from 'common/js/singer'
import ListView from '@/base/listView/listView'

const HOT_NAME = '热门'
const HOT_NAME_LEN = 10
export default {
  components: {
    ListView
  },
  data() {
    return {
      singers: []
    }
  },
  created() {
    this._getSingers()
  },
  methods: {
    _getSingers() {
      getSingers().then((res) => {
        this.singers = res.data.list
        let finalRes = this.normallizeSinger(this.singers)
        this.singers = finalRes
        console.log(finalRes)
      })
    },
    normallizeSinger(data) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      data.forEach((val, key) => {
        // 过滤出热门歌手
        if (key < HOT_NAME_LEN) {
          map.hot.items.push(new Singer(val.Fsinger_mid, val.Fsinger_name))
        }
        // 过滤出其他（相同首字母）的歌手
        let k = val.Findex
        if (!map[k]) {
          map[k] = {
            title: k,
            items: []
          }
        }
        map[k].items.push(new Singer(val.Fsinger_mid, val.Fsinger_name))
      })
      // 处理map为有序列表（热门,A,B...）
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else {
          if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
      }
      return hot.concat(ret)
    }
  }
}
</script>
<style>

</style>