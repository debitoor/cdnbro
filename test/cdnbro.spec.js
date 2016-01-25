var port = process.env.PORT || 8080
var server = require('./server')

const Browser = require('zombie')
Browser.localhost('localhost', port)
const browser = new Browser()

describe('starting test server', function () {
  before(function (done) {
    server(port, done)
  })

  describe('when cdn works', function () {
    before(function () {
      return browser.visit('/cdn-works.html')
    })

    it('should run cdn scripts in given order', function () {
      browser.assert.text('title', 'cdn-works')
    })
  })

  describe('when cdn fails', function () {
    before(function () {
      return browser.visit('/cdn-fails.html')
    })

    it('should run fallback scripts in given order', function () {
      browser.assert.text('title', 'cdn-fallback-works')
    })
  })

  describe('when cdn times out', function () {
    before(function () {
      return browser.visit('/cdn-times-out.html')
    })

    it('should run fallback scripts in given order', function () {
      browser.assert.text('title', 'cdn-fallback-works-fast')
    })
  })
})
