export function addClass(el, className) {
  if (hasClass(el, className)) {
    return false
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join('')
}

function hasClass(el, className) {
  let reg = /(\\s|^)className(\\s|$)/
  return reg.test(el.className)
}

export function getElAttr(el, name, val) {
  let prefix = 'data-'
  if (val) {
    return el.setAttribute(prefix + name, val)
  } else {
    return el.getAttribute(prefix + name)
  }
}

let elmentStyle = document.createElement('div').style
let vender = (function() {
  let transformNames = {
    standard: 'transform',
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform'
  }
  for (var k in transformNames) {
    if (elmentStyle[transformNames[k]] !== 'undefined') {
      return k
    }
  }
  return false
})()

export function prefixStyle(style) {
  if (vender === false) {
    return false
  }
  if (vender === 'standard') {
    return style
  }
  return vender + style.charAt(0).toUpperCase() + style.substr(1)
}