import {playMode} from 'common/js/config'
const state = {
  singer: {},
  playing: false, // 播放状态
  fullScreen: true, // 全屏状态
  playList: [], // 播放列表
  sequenceList: [], // 顺序播放类别
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前播放歌曲索引
  disc: {}, // 推荐歌单概括信息
  topinfo: {} // 排行榜歌单信息
}
export default state