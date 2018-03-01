<template>
  <div id="app">
    <Mheader></Mheader>
    <Tab></Tab>
    <keep-alive>
      <router-view class="content-wrapper"/>
    </keep-alive>
    <Player></Player>
  </div>
</template>

<script>
import Mheader from '@/components/header/header'
import Tab from '@/components/tab/tab'
import Player from '@/components/player/player'
export default {
  name: 'App',
  components: {
    Mheader,
    Tab,
    Player
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .content-wrapper
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
</style>
