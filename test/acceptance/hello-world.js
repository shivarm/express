var { describe, it } = require('node:test')


var app = require('../../examples/hello-world')
var request = require('supertest')

describe('hello-world', function () {
  describe('GET /', function () {
    it('should respond with hello world', function (t) {
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
        .expect(200, 'Hello World', done)


      })
    })
  })

  describe('GET /missing', function () {
    it('should respond with 404', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(app)
        .get('/missing')
        .expect(404, done)


      })
    })
  })
})
