var chai = require('chai')
chai.use(require('chai-pretty-expect'))
chai.use(require('chai-subset'))
chai.config.includeStack = true
global.expect = chai.expect
