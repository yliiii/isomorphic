export function getStyle(obj, attr) {
  return obj.currentStyle ? obj.currentStyle[attr] : window.getComputedStyle(obj, null)[attr];
}

export function hasClass(obj, cls) {
  let re = new RegExp('(\\s|^)' + cls + '(\\s|$)')
  return re.test(obj.className)
}

export function addClass(obj, cls) {
  if (!cls || !obj) return obj;

  let classStr = '';

  if (typeof cls === 'string') {
    cls = cls.replace(/\s{1,}/g, '|').split('|')
  }

  cls.forEach(name => {
    if (!!name && !hasClass(obj, name)) {
      classStr += ' ' + name
    }
  })

  obj.className += classStr

  return obj
}

export function removeClass(obj, cls) {
  if (!cls || !obj) return obj

  if (typeof cls === 'string') {
    cls = cls.replace(/\s{1,}/g, '|').split('|')
  }

  if (document.body.classList) {
    cls.forEach(name => {
      if (name) obj.classList.remove(name)
    })
  } else {
    let classStr = obj.className;

    cls.forEach(name => {
      if (name) classStr = classStr.replace(new RegExp(name, 'g'), '')
    })

    obj.className = classStr
  }

  return obj
}

export function toggleClass(obj, cls) {
  if (hasClass(obj, cls)) {
    removeClass(obj, cls);
  } else {
    addClass(obj, cls);
  }
}

export function getElementOffsetClientPosition(element) {
  let top = element.offsetTop
  let left = element.offsetLeft
  while (element.offsetParent) {
    element = element.offsetParent
    top += element.offsetTop
    left += element.offsetLeft
  }
  return {
    top,
    left
  }
}

export default {
  getStyle,
  hasClass,
  addClass,
  removeClass,
  toggleClass,
  getElementOffsetClientPosition
}
