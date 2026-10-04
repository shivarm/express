var { describe, it } = require('node:test')


var app = require('../../examples/markdown')
var request = require('supertest')

describe('markdown', function(){
  describe('GET /', function(){
    it('should respond with html', function (t) {
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
        .expect(/<h1[^>]*>Markdown Example<\/h1>/,done)


      })
    })
  })

  describe('GET /fail',function(){
    it('should respond with an error', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(app)
        .get('/fail')
        .expect(500,done)


      })
    })
  })
})
