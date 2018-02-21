import originJsonp from 'jsonp'

export default function jsonp(url, data, options) {
  var _url = url.indexOf('?') < 0 ? url + '?' : url + '&'
  _url += formatParams(data)
  return new Promise(function (resolve, reject) {
    originJsonp(_url, options, function (err, data) {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function formatParams(data) {
  let url = ''
  for (var k in data) {
    let val = data[k] !== 'undefind' ? data[k] : ''
    if (typeof val === 'object') {
      url += `&${k}=${encodeURIComponent(JSON.stringify(val))}`
    } else {
      url += `&${k}=${encodeURIComponent(val)}`
    }
  }
  return url ? url.substring(1) : ''
}
