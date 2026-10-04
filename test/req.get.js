'use strict'

var { describe, it } = require('node:test')

var express = require('../')
  , request = require('supertest')
  , assert = require('node:assert');

describe('req', function(){
  describe('.get(field)', function(){
    it('should return the header field value', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        var app = express();

        app.use(function(req, res){
          assert(req.get('Something-Else') === undefined);
          res.end(req.get('Content-Type'));
        });

        request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .expect('application/json', done);


      })
    })

    it('should special-case Referer', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        var app = express();

        app.use(function(req, res){
          res.end(req.get('Referer'));
        });

        request(app)
      .post('/')
      .set('Referrer', 'http://foobar.com')
      .expect('http://foobar.com', done);


      })
    })

    it('should throw missing header name', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        var app = express()

        app.use(function (req, res) {
          res.end(req.get())
        })

        request(app)
      .get('/')
      .expect(500, /TypeError: name argument is required to req.get/, done)


      })
    })

    it('should throw for non-string header name', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        var app = express()

        app.use(function (req, res) {
          res.end(req.get(42))
        })

        request(app)
      .get('/')
      .expect(500, /TypeError: name must be a string to req.get/, done)


      })
    })
  })
})
