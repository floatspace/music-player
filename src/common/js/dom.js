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