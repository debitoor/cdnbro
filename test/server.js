var app = require('express')()
var http = require('http')
var fs = require('fs')

var cdnbro = fs.readFileSync(__dirname + '/../index.js', 'utf-8')

app.use(function (req, res, next) {
  if (req.path.indexOf('.html') !== -1) {
    var tmpl = fs.readFileSync(__dirname + req.path, 'utf-8')
    var html = tmpl.replace('[cdnbro]', cdnbro)
    return res.send(html)
  }

  if (req.path.indexOf('asset') === -1) return next()

  var content = req.path.indexOf('.css') !== -1
    ? req.query.text || 'body{}'
    : 'document.title+="' + req.query.text + '"' || ';'

  setTimeout(function () {
    res.send(content)
  }, req.query.hang || 0)
})

var server = http.createServer(app)

module.exports = function (port, cb) {
  server.listen(port, cb)
}
