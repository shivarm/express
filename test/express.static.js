'use strict'

var { describe, it, before } = require('node:test')

var testApp

var assert = require('node:assert')
var express = require('..')
var path = require('node:path')
const { Buffer } = require('node:buffer');

var request = require('supertest')
var utils = require('./support/utils')

var fixtures = path.join(__dirname, '/fixtures')
var relative = path.relative(process.cwd(), fixtures)

var skipRelative = ~relative.indexOf('..') || path.resolve(relative) === relative

describe('express.static()', function () {
  describe('basic operations', function () {
    before(function () {
      testApp = createApp()
    })

    it('should require root path', function () {
      assert.throws(express.static.bind(), /root path required/)
    })

    it('should require root path to be string', function () {
      assert.throws(express.static.bind(null, 42), /root path.*string/)
    })

    it('should serve static files', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/todo.txt')
        .expect(200, '- groceries', done)


      })
    })

    it('should support nesting', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/users/tobi.txt')
        .expect(200, 'ferret', done)


      })
    })

    it('should set Content-Type', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/todo.txt')
        .expect('Content-Type', 'text/plain; charset=utf-8')
        .expect(200, done)


      })
    })

    it('should set Last-Modified', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/todo.txt')
        .expect('Last-Modified', /\d{2} \w{3} \d{4}/)
        .expect(200, done)


      })
    })

    it('should default max-age=0', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/todo.txt')
        .expect('Cache-Control', 'public, max-age=0')
        .expect(200, done)


      })
    })

    it('should support urlencoded pathnames', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/%25%20of%20dogs.txt')
        .expect(200, '20%', done)


      })
    })

    it('should not choke on auth-looking URL', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('//todo@txt')
        .expect(404, 'Not Found', done)


      })
    })

    it('should support index.html', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/users/')
        .expect(200)
        .expect('Content-Type', /html/)
        .expect('<p>tobi, loki, jane</p>', done)


      })
    })

    it('should support ../', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/users/../todo.txt')
        .expect(200, '- groceries', done)


      })
    })

    it('should support HEAD', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .head('/todo.txt')
        .expect(200)
        .expect(utils.shouldNotHaveBody())
        .end(done)


      })
    })

    it('should skip POST requests', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .post('/todo.txt')
        .expect(404, 'Not Found', done)


      })
    })

    it('should support conditional requests', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        var app = testApp

        request(app)
        .get('/todo.txt')
        .end(function (err, res) {
          if (err) throw err
          request(app)
            .get('/todo.txt')
            .set('If-None-Match', res.headers.etag)
            .expect(304, done)
        })


      })
    })

    it('should support precondition checks', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/todo.txt')
        .set('If-Match', '"foo"')
        .expect(412, done)


      })
    })

    it('should serve zero-length files', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/empty.txt')
        .expect(200, '', done)


      })
    })

    it('should ignore hidden files', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/.name')
        .expect(404, 'Not Found', done)


      })
    })
  });

  (skipRelative ? describe.skip : describe)('current dir', function () {
    before(function () {
      testApp = createApp('.')
    })

    it('should be served with "."', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        var dest = relative.split(path.sep).join('/')
        request(testApp)
        .get('/' + dest + '/todo.txt')
        .expect(200, '- groceries', done)


      })
    })
  })

  describe('acceptRanges', function () {
    describe('when false', function () {
      it('should not include Accept-Ranges', function (t) {
        return new Promise(function (resolve, reject) {
          var done = function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          }

          request(createApp(fixtures, { 'acceptRanges': false }))
          .get('/nums.txt')
          .expect(utils.shouldNotHaveHeader('Accept-Ranges'))
          .expect(200, '123456789', done)


        })
      })

      it('should ignore Rage request header', function (t) {
        return new Promise(function (resolve, reject) {
          var done = function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          }

          request(createApp(fixtures, { 'acceptRanges': false }))
          .get('/nums.txt')
          .set('Range', 'bytes=0-3')
          .expect(utils.shouldNotHaveHeader('Accept-Ranges'))
          .expect(utils.shouldNotHaveHeader('Content-Range'))
          .expect(200, '123456789', done)


        })
      })
    })

    describe('when true', function () {
      it('should include Accept-Ranges', function (t) {
        return new Promise(function (resolve, reject) {
          var done = function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          }

          request(createApp(fixtures, { 'acceptRanges': true }))
          .get('/nums.txt')
          .expect('Accept-Ranges', 'bytes')
          .expect(200, '123456789', done)


        })
      })

      it('should obey Rage request header', function (t) {
        return new Promise(function (resolve, reject) {
          var done = function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          }

          request(createApp(fixtures, { 'acceptRanges': true }))
          .get('/nums.txt')
          .set('Range', 'bytes=0-3')
          .expect('Accept-Ranges', 'bytes')
          .expect('Content-Range', 'bytes 0-3/9')
          .expect(206, '1234', done)


        })
      })
    })
  })

  describe('cacheControl', function () {
    describe('when false', function () {
      it('should not include Cache-Control', function (t) {
        return new Promise(function (resolve, reject) {
          var done = function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          }

          request(createApp(fixtures, { 'cacheControl': false }))
          .get('/nums.txt')
          .expect(utils.shouldNotHaveHeader('Cache-Control'))
          .expect(200, '123456789', done)


        })
      })

      it('should ignore maxAge', function (t) {
        return new Promise(function (resolve, reject) {
          var done = function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          }

          request(createApp(fixtures, { 'cacheControl': false, 'maxAge': 12000 }))
          .get('/nums.txt')
          .expect(utils.shouldNotHaveHeader('Cache-Control'))
          .expect(200, '123456789', done)


        })
      })
    })

    describe('when true', function () {
      it('should include Cache-Control', function (t) {
        return new Promise(function (resolve, reject) {
          var done = function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          }

          request(createApp(fixtures, { 'cacheControl': true }))
          .get('/nums.txt')
          .expect('Cache-Control', 'public, max-age=0')
          .expect(200, '123456789', done)


        })
      })
    })
  })

  describe('extensions', function () {
    it('should be not be enabled by default', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(createApp(fixtures))
        .get('/todo')
        .expect(404, done)


      })
    })

    it('should be configurable', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(createApp(fixtures, { 'extensions': 'txt' }))
        .get('/todo')
        .expect(200, '- groceries', done)


      })
    })

    it('should support disabling extensions', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(createApp(fixtures, { 'extensions': false }))
        .get('/todo')
        .expect(404, done)


      })
    })

    it('should support fallbacks', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(createApp(fixtures, { 'extensions': ['htm', 'html', 'txt'] }))
        .get('/todo')
        .expect(200, '<li>groceries</li>', done)


      })
    })

    it('should 404 if nothing found', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(createApp(fixtures, { 'extensions': ['htm', 'html', 'txt'] }))
        .get('/bob')
        .expect(404, done)


      })
    })
  })

  describe('fallthrough', function () {
    it('should default to true', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(createApp())
        .get('/does-not-exist')
        .expect(404, 'Not Found', done)


      })
    })

    describe('when true', function () {
      before(function () {
        testApp = createApp(fixtures, { 'fallthrough': true })
      })

      it('should fall-through when OPTIONS request', function (t) {
        return new Promise(function (resolve, reject) {
          var done = function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          }

          request(testApp)
          .options('/todo.txt')
          .expect(404, 'Not Found', done)


        })
      })

      it('should fall-through when URL malformed', function (t) {
        return new Promise(function (resolve, reject) {
          var done = function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          }

          request(testApp)
          .get('/%')
          .expect(404, 'Not Found', done)


        })
      })

      it('should fall-through when traversing past root', function (t) {
        return new Promise(function (resolve, reject) {
          var done = function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          }

          request(testApp)
          .get('/users/../../todo.txt')
          .expect(404, 'Not Found', done)


        })
      })

      it('should fall-through when URL too long', function (t) {
        return new Promise(function (resolve, reject) {
          var done = function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          }

          var app = express()
          var root = fixtures + Array(10000).join('/foobar')

          app.use(express.static(root, { 'fallthrough': true }))
          app.use(function (req, res, next) {
            res.sendStatus(404)
          })

          request(app)
          .get('/')
          .expect(404, 'Not Found', done)


        })
      })

      describe('with redirect: true', function () {
        before(function () {
          testApp = createApp(fixtures, { 'fallthrough': true, 'redirect': true })
        })

        it('should fall-through when directory', function (t) {
          return new Promise(function (resolve, reject) {
            var done = function (err) {
              if (err) {
                reject(err)
                return
              }
              resolve()
            }

            request(testApp)
            .get('/pets/')
            .expect(404, 'Not Found', done)


          })
        })

        it('should redirect when directory without slash', function (t) {
          return new Promise(function (resolve, reject) {
            var done = function (err) {
              if (err) {
                reject(err)
                return
              }
              resolve()
            }

            request(testApp)
            .get('/pets')
            .expect(301, /Redirecting/, done)


          })
        })
      })

      describe('with redirect: false', function () {
        before(function () {
          testApp = createApp(fixtures, { 'fallthrough': true, 'redirect': false })
        })

        it('should fall-through when directory', function (t) {
          return new Promise(function (resolve, reject) {
            var done = function (err) {
              if (err) {
                reject(err)
                return
              }
              resolve()
            }

            request(testApp)
            .get('/pets/')
            .expect(404, 'Not Found', done)


          })
        })

        it('should fall-through when directory without slash', function (t) {
          return new Promise(function (resolve, reject) {
            var done = function (err) {
              if (err) {
                reject(err)
                return
              }
              resolve()
            }

            request(testApp)
            .get('/pets')
            .expect(404, 'Not Found', done)


          })
        })
      })
    })

    describe('when false', function () {
      before(function () {
        testApp = createApp(fixtures, { 'fallthrough': false })
      })

      it('should 405 when OPTIONS request', function (t) {
        return new Promise(function (resolve, reject) {
          var done = function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          }

          request(testApp)
          .options('/todo.txt')
          .expect('Allow', 'GET, HEAD')
          .expect(405, done)


        })
      })

      it('should 400 when URL malformed', function (t) {
        return new Promise(function (resolve, reject) {
          var done = function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          }

          request(testApp)
          .get('/%')
          .expect(400, /BadRequestError/, done)


        })
      })

      it('should 403 when traversing past root', function (t) {
        return new Promise(function (resolve, reject) {
          var done = function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          }

          request(testApp)
          .get('/users/../../todo.txt')
          .expect(403, /ForbiddenError/, done)


        })
      })

      it('should 404 when URL too long', function (t) {
        return new Promise(function (resolve, reject) {
          var done = function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          }

          var app = express()
          var root = fixtures + Array(10000).join('/foobar')

          app.use(express.static(root, { 'fallthrough': false }))
          app.use(function (req, res, next) {
            res.sendStatus(404)
          })

          request(app)
          .get('/')
          .expect(404, /ENAMETOOLONG/, done)


        })
      })

      describe('with redirect: true', function () {
        before(function () {
          testApp = createApp(fixtures, { 'fallthrough': false, 'redirect': true })
        })

        it('should 404 when directory', function (t) {
          return new Promise(function (resolve, reject) {
            var done = function (err) {
              if (err) {
                reject(err)
                return
              }
              resolve()
            }

            request(testApp)
            .get('/pets/')
            .expect(404, /NotFoundError|ENOENT/, done)


          })
        })

        it('should redirect when directory without slash', function (t) {
          return new Promise(function (resolve, reject) {
            var done = function (err) {
              if (err) {
                reject(err)
                return
              }
              resolve()
            }

            request(testApp)
            .get('/pets')
            .expect(301, /Redirecting/, done)


          })
        })
      })

      describe('with redirect: false', function () {
        before(function () {
          testApp = createApp(fixtures, { 'fallthrough': false, 'redirect': false })
        })

        it('should 404 when directory', function (t) {
          return new Promise(function (resolve, reject) {
            var done = function (err) {
              if (err) {
                reject(err)
                return
              }
              resolve()
            }

            request(testApp)
            .get('/pets/')
            .expect(404, /NotFoundError|ENOENT/, done)


          })
        })

        it('should 404 when directory without slash', function (t) {
          return new Promise(function (resolve, reject) {
            var done = function (err) {
              if (err) {
                reject(err)
                return
              }
              resolve()
            }

            request(testApp)
            .get('/pets')
            .expect(404, /NotFoundError|ENOENT/, done)


          })
        })
      })
    })
  })

  describe('hidden files', function () {
    before(function () {
      testApp = createApp(fixtures, { 'dotfiles': 'allow' })
    })

    it('should be served when dotfiles: "allow" is given', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/.name')
        .expect(200)
        .expect(utils.shouldHaveBody(Buffer.from('tobi')))
        .end(done)


      })
    })
  })

  describe('immutable', function () {
    it('should default to false', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(createApp(fixtures))
        .get('/nums.txt')
        .expect('Cache-Control', 'public, max-age=0', done)


      })
    })

    it('should set immutable directive in Cache-Control', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(createApp(fixtures, { 'immutable': true, 'maxAge': '1h' }))
        .get('/nums.txt')
        .expect('Cache-Control', 'public, max-age=3600, immutable', done)


      })
    })
  })

  describe('lastModified', function () {
    describe('when false', function () {
      it('should not include Last-Modified', function (t) {
        return new Promise(function (resolve, reject) {
          var done = function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          }

          request(createApp(fixtures, { 'lastModified': false }))
          .get('/nums.txt')
          .expect(utils.shouldNotHaveHeader('Last-Modified'))
          .expect(200, '123456789', done)


        })
      })
    })

    describe('when true', function () {
      it('should include Last-Modified', function (t) {
        return new Promise(function (resolve, reject) {
          var done = function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          }

          request(createApp(fixtures, { 'lastModified': true }))
          .get('/nums.txt')
          .expect('Last-Modified', /^\w{3}, \d+ \w+ \d+ \d+:\d+:\d+ \w+$/)
          .expect(200, '123456789', done)


        })
      })
    })
  })

  describe('maxAge', function () {
    it('should accept string', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(createApp(fixtures, { 'maxAge': '30d' }))
        .get('/todo.txt')
        .expect('cache-control', 'public, max-age=' + (60 * 60 * 24 * 30))
        .expect(200, done)


      })
    })

    it('should be reasonable when infinite', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(createApp(fixtures, { 'maxAge': Infinity }))
        .get('/todo.txt')
        .expect('cache-control', 'public, max-age=' + (60 * 60 * 24 * 365))
        .expect(200, done)


      })
    })
  })

  describe('redirect', function () {
    before(function () {
      testApp = express()
      testApp.use(function (req, res, next) {
        req.originalUrl = req.url =
          req.originalUrl.replace(/\/snow(\/|$)/, '/snow \u2603$1')
        next()
      })
      testApp.use(express.static(fixtures))
    })

    it('should redirect directories', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/users')
        .expect('Location', '/users/')
        .expect(301, done)


      })
    })

    it('should include HTML link', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/users')
        .expect('Location', '/users/')
        .expect(301, /\/users\//, done)


      })
    })

    it('should redirect directories with query string', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/users?name=john')
        .expect('Location', '/users/?name=john')
        .expect(301, done)


      })
    })

    it('should not redirect to protocol-relative locations', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('//users')
        .expect('Location', '/users/')
        .expect(301, done)


      })
    })

    it('should ensure redirect URL is properly encoded', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/snow')
        .expect('Location', '/snow%20%E2%98%83/')
        .expect('Content-Type', /html/)
        .expect(301, />Redirecting to \/snow%20%E2%98%83\/</, done)


      })
    })

    it('should respond with default Content-Security-Policy', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/users')
        .expect('Content-Security-Policy', "default-src 'none'")
        .expect(301, done)


      })
    })

    it('should not redirect incorrectly', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/')
        .expect(404, done)


      })
    })

    describe('when false', function () {
      before(function () {
        testApp = createApp(fixtures, { 'redirect': false })
      })

      it('should disable redirect', function (t) {
        return new Promise(function (resolve, reject) {
          var done = function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          }

          request(testApp)
          .get('/users')
          .expect(404, done)


        })
      })
    })
  })

  describe('setHeaders', function () {
    before(function () {
      testApp = express()
      testApp.use(express.static(fixtures, { 'setHeaders': function (res) {
        res.setHeader('x-custom', 'set')
      } }))
    })

    it('should reject non-functions', function () {
      assert.throws(express.static.bind(null, fixtures, { 'setHeaders': 3 }), /setHeaders.*function/)
    })

    it('should get called when sending file', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/nums.txt')
        .expect('x-custom', 'set')
        .expect(200, done)


      })
    })

    it('should not get called on 404', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/bogus')
        .expect(utils.shouldNotHaveHeader('x-custom'))
        .expect(404, done)


      })
    })

    it('should not get called on redirect', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/users')
        .expect(utils.shouldNotHaveHeader('x-custom'))
        .expect(301, done)


      })
    })
  })

  describe('when traversing past root', function () {
    before(function () {
      testApp = createApp(fixtures, { 'fallthrough': false })
    })

    it('should catch urlencoded ../', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/users/%2e%2e/%2e%2e/todo.txt')
        .expect(403, done)


      })
    })

    it('should not allow root path disclosure', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/users/../../fixtures/todo.txt')
        .expect(403, done)


      })
    })
  })

  describe('when request has "Range" header', function () {
    before(function () {
      testApp = createApp()
    })

    it('should support byte ranges', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/nums.txt')
        .set('Range', 'bytes=0-4')
        .expect('12345', done)


      })
    })

    it('should be inclusive', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/nums.txt')
        .set('Range', 'bytes=0-0')
        .expect('1', done)


      })
    })

    it('should set Content-Range', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/nums.txt')
        .set('Range', 'bytes=2-5')
        .expect('Content-Range', 'bytes 2-5/9', done)


      })
    })

    it('should support -n', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/nums.txt')
        .set('Range', 'bytes=-3')
        .expect('789', done)


      })
    })

    it('should support n-', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/nums.txt')
        .set('Range', 'bytes=3-')
        .expect('456789', done)


      })
    })

    it('should respond with 206 "Partial Content"', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/nums.txt')
        .set('Range', 'bytes=0-4')
        .expect(206, done)


      })
    })

    it('should set Content-Length to the # of octets transferred', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/nums.txt')
        .set('Range', 'bytes=2-3')
        .expect('Content-Length', '2')
        .expect(206, '34', done)


      })
    })

    describe('when last-byte-pos of the range is greater than current length', function () {
      it('is taken to be equal to one less than the current length', function (t) {
        return new Promise(function (resolve, reject) {
          var done = function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          }

          request(testApp)
          .get('/nums.txt')
          .set('Range', 'bytes=2-50')
          .expect('Content-Range', 'bytes 2-8/9', done)


        })
      })

      it('should adapt the Content-Length accordingly', function (t) {
        return new Promise(function (resolve, reject) {
          var done = function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          }

          request(testApp)
          .get('/nums.txt')
          .set('Range', 'bytes=2-50')
          .expect('Content-Length', '7')
          .expect(206, done)


        })
      })
    })

    describe('when the first- byte-pos of the range is greater than the current length', function () {
      it('should respond with 416', function (t) {
        return new Promise(function (resolve, reject) {
          var done = function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          }

          request(testApp)
          .get('/nums.txt')
          .set('Range', 'bytes=9-50')
          .expect(416, done)


        })
      })

      it('should include a Content-Range header of complete length', function (t) {
        return new Promise(function (resolve, reject) {
          var done = function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          }

          request(testApp)
          .get('/nums.txt')
          .set('Range', 'bytes=9-50')
          .expect('Content-Range', 'bytes */9')
          .expect(416, done)


        })
      })
    })

    describe('when syntactically invalid', function () {
      it('should respond with 200 and the entire contents', function (t) {
        return new Promise(function (resolve, reject) {
          var done = function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          }

          request(testApp)
          .get('/nums.txt')
          .set('Range', 'asdf')
          .expect('123456789', done)


        })
      })
    })
  })

  describe('when index at mount point', function () {
    before(function () {
      testApp = express()
      testApp.use('/users', express.static(fixtures + '/users'))
    })

    it('should redirect correctly', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/users')
        .expect('Location', '/users/')
        .expect(301, done)


      })
    })
  })

  describe('when mounted', function () {
    before(function () {
      testApp = express()
      testApp.use('/static', express.static(fixtures))
    })

    it('should redirect relative to the originalUrl', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/static/users')
        .expect('Location', '/static/users/')
        .expect(301, done)


      })
    })

    it('should not choke on auth-looking URL', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('//todo@txt')
        .expect(404, done)


      })
    })
  })

  //
  // NOTE: This is not a real part of the API, but
  //       over time this has become something users
  //       are doing, so this will prevent unseen
  //       regressions around this use-case.
  //
  describe('when mounted "root" as a file', function () {
    before(function () {
      testApp = express()
      testApp.use('/todo.txt', express.static(fixtures + '/todo.txt'))
    })

    it('should load the file when on trailing slash', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/todo.txt')
        .expect(200, '- groceries', done)


      })
    })

    it('should 404 when trailing slash', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/todo.txt/')
        .expect(404, done)


      })
    })
  })

  describe('when responding non-2xx or 304', function () {
    it('should not alter the status', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        var app = express()

        app.use(function (req, res, next) {
          res.status(501)
          next()
        })
        app.use(express.static(fixtures))

        request(app)
        .get('/todo.txt')
        .expect(501, '- groceries', done)


      })
    })
  })

  describe('when index file serving disabled', function () {
    before(function () {
      testApp = express()
      testApp.use('/static', express.static(fixtures, { 'index': false }))
      testApp.use(function (req, res, next) {
        res.sendStatus(404)
      })
    })

    it('should next() on directory', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/static/users/')
        .expect(404, 'Not Found', done)


      })
    })

    it('should redirect to trailing slash', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/static/users')
        .expect('Location', '/static/users/')
        .expect(301, done)


      })
    })

    it('should next() on mount point', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/static/')
        .expect(404, 'Not Found', done)


      })
    })

    it('should redirect to trailing slash mount point', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/static')
        .expect('Location', '/static/')
        .expect(301, done)


      })
    })
  })
})

function createApp (dir, options, fn) {
  var app = express()
  var root = dir || fixtures

  app.use(express.static(root, options))

  app.use(function (req, res, next) {
    res.sendStatus(404)
  })

  return app
}
