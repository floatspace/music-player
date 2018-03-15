export const shuffle = function(arr) {
  let _arr = arr.slice()
  for (let i = 0, len = _arr.length; i < len; i++) {
    let randomNum = getRandomNum(i, len)
    let temp = _arr[i]
    _arr[i] = _arr[randomNum]
    _arr[randomNum] = temp
  }
  return _arr
}

function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

export const debounce = function(fn, delay) {
  let timer
  return function() {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, delay)
  }
}