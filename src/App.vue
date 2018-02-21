<template>
  <div id="app">
    <Mheader></Mheader>
    <Tab></Tab>
    <keep-alive>
      <router-view class="content-wrapper"/>
    </keep-alive>
  </div>
</template>

<script>
import Mheader from '@/components/header/header'
import Tab from '@/components/tab/tab'
export default {
  name: 'App',
  components: {
    Mheader,
    Tab
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
