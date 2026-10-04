var { describe, it } = require('node:test')


var app = require('../../examples/error')
  , request = require('supertest');

describe('error', function(){
  describe('GET /', function(){
    it('should respond with 500', function (t) {
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
        .expect(500,done)


      })
    })
  })

  describe('GET /next', function(){
    it('should respond with 500', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(app)
        .get('/next')
        .expect(500,done)


      })
    })
  })

  describe('GET /missing', function(){
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
        .expect(404,done)


      })
    })
  })
})
