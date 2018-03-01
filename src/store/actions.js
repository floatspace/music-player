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

function getIndex(list, song) {
  let _index = list.findIndex((item) => {
    return item.id === song.id
  })
  return _index
}