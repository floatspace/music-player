import * as types from './mutation-types'
import * as utils from 'common/js/util'
import {playMode} from 'common/js/config'

export const selectPlay = function({commit, state}, {list, index}) {
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
  let _index = index
  if (state.mode === playMode.random) {
    let randomList = utils.shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    _index = getIndex(randomList, list[index])
    console.log(_index)
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, _index)
  commit(types.SET_SEQUENCE_LIST, list)
}

export const randomPlay = function({commit, state}, {list}) {
  let randomList = utils.shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_MODE, playMode.random)
}

export const insertSong = function({commit, state}, {song}) {
  let songList = state.playList.slice()
  let curIndex = state.currentIndex
  // 获取插入的歌曲在列表中的索引，-1表示不存在列表中
  let songIndex = getIndex(songList, song)
  songList.push(song)
  if (songIndex !== -1) {
    // 存在，根据索引songIndex删除
    songList.splice(songIndex, 1, 0)
  }
  curIndex = songList.length - 1
  commit(types.SET_PLAYLIST, songList)
  commit(types.SET_SEQUENCE_LIST, songList)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_CURRENT_INDEX, curIndex)
}

function getIndex(list, song) {
  let _index = list.findIndex((item) => {
    return item.id === song.id
  })
  return _index
}