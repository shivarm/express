var { describe, it } = require('node:test')


var app = require('../../examples/cookie-sessions')
var request = require('supertest')

describe('cookie-sessions', function () {
  describe('GET /', function () {
    it('should display no views', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(app)
      .get('/')
      .expect(200, 'viewed 1 times\n', done)


      })
    })

    it('should set a session cookie', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(app)
      .get('/')
      .expect('Set-Cookie', /session=/)
      .expect(200, done)


      })
    })

    it('should display 1 view on revisit', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(app)
      .get('/')
      .expect(200, 'viewed 1 times\n', function (err, res) {
        if (err) return done(err)
        request(app)
        .get('/')
        .set('Cookie', getCookies(res))
        .expect(200, 'viewed 2 times\n', done)
      })


      })
    })
  })
})

function getCookies(res) {
  return res.headers['set-cookie'].map(function (val) {
    return val.split(';')[0]
  }).join('; ');
}
