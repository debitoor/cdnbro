!(function () {
  var me
  var w = window
  var d = document
  var flag = 'cdn-failed'
  var flagExpires = 1000 * 60 * 60 * 24

  w.cdnbro = me = function (cdn, nocdn, timeout) {
    cdnFailed()
      ? loadAssets(nocdn)
      : loadAssets(cdn, timeout, function (err) {
        if (!err) return setCdnOk()
        loadAssets(nocdn)
        setCdnFailed()
      })
  }

  function loadAssets (assets, timeout, cb) {
    cb = cb || function () {}
    var start = Date.now()
    var tasks = []
    var abort

    timeout && setTimeout(function () {
      if (!abort && tasks.length !== 0) cb(1)
    }, timeout)

    assets.forEach(function (url, i) {
      tasks.push({id: i, url: url})
      fetch(url, function (err, src) {
        if (!abort && err) {
          abort = 1
          return cb(err)
        }
        var task = tasks.filter(function (t) {
          return t.url === url
        })[0]
        task.src = src
        ontask()
      })
    })

    function ontask () {
      var task = tasks[0]
      if (!task.src) return
      loadAsset(task)
      tasks.shift()
      if (tasks.length) return ontask()
      me.done = me.done || Date.now() - start
      cb()
    }
  }

  function loadAsset (asset) {
    if (me['_src' + asset.id]) {
      delete asset.src
      return
    }

    /.js/.test(asset.url)
      ? loadJs(asset)
      : loadCss(asset)

    delete asset.src
    me['_src' + asset.id] = 1
  }

  function loadCss (asset) {
    var s = d.createElement('style')
    s.innerHTML = asset.src
    d.head.appendChild(s)
    s = null
  }

  function loadJs (asset) {
    var s = d.createElement('script')
    s.innerHTML = asset.src
    s.crossorigin = 'anonymous'
    ondom(function () {
      d.body.appendChild(s)
      try { d.body.removeChild(s) } catch (e) { }
      s = null
    })
  }

  function ondom (cb) {
    d.readyState === 'interactive' ||
    d.readyState === 'complete'
      ? cb()
      : d.addEventListener('DOMContentLoaded', cb)
  }

  function fetch (url, cb) {
    var xhr = new w.XMLHttpRequest()
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return
      if (!xhr.status || xhr.status >= 400) return cb(1)
      cb(0, xhr.responseText)
    }
    xhr.open('GET', url, 1)
    xhr.send()
    return xhr
  }

  function cdnFailed () {
    try {
      var ts = w.localStorage.getItem(flag)
      if (!ts) return false
      return Date.now() - ts < flagExpires
    } catch (ex) {
      return false
    }
  }

  function setCdnFailed () {
    try { w.localStorage.setItem(flag, Date.now()) } catch (ex) { }
  }

  function setCdnOk () {
    try { w.localStorage.removeItem(flag) } catch (ex) { }
  }
})()
