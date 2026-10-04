var { describe, it } = require('node:test')

var app = require('../../examples/vhost')
var request = require('supertest')

describe('vhost', function(){
  describe('example.com', function(){
    describe('GET /', function(){
      it('should say hello', function (t) {
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
        .set('Host', 'example.com')
        .expect(200, /hello/i, done)


        })
      })
    })

    describe('GET /foo', function(){
      it('should say foo', function (t) {
        return new Promise(function (resolve, reject) {
          var done = function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          }

          request(app)
        .get('/foo')
        .set('Host', 'example.com')
        .expect(200, 'requested foo', done)


        })
      })
    })
  })

  describe('foo.example.com', function(){
    describe('GET /', function(){
      it('should redirect to /foo', function (t) {
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
        .set('Host', 'foo.example.com')
        .expect(302, /Redirecting to http:\/\/example.com:3000\/foo/, done)


        })
      })
    })
  })

  describe('bar.example.com', function(){
    describe('GET /', function(){
      it('should redirect to /bar', function (t) {
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
        .set('Host', 'bar.example.com')
        .expect(302, /Redirecting to http:\/\/example.com:3000\/bar/, done)


        })
      })
    })
  })
})
