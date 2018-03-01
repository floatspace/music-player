export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playList = state => state.playList

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
  console.log('当前播放歌曲')
  console.log(state.playList[state.currentIndex])
  return state.playList[state.currentIndex] // 注：此处为state而不是this
}