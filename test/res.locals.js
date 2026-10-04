'use strict'

var { describe, it } = require('node:test')

var express = require('../')
  , request = require('supertest');

describe('res', function(){
  describe('.locals', function(){
    it('should be empty by default', function (t) {
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
          res.json(res.locals)
        });

        request(app)
      .get('/')
      .expect(200, {}, done)


      })
    })
  })

  it('should work when mounted', function (t) {
    return new Promise(function (resolve, reject) {
      var done = function (err) {
        if (err) {
          reject(err)
          return
        }
        resolve()
      }

      var app = express();
      var blog = express();

      app.use(blog);

      blog.use(function(req, res, next){
        res.locals.foo = 'bar';
        next();
      });

      app.use(function(req, res){
        res.json(res.locals)
      });

      request(app)
    .get('/')
    .expect(200, { foo: 'bar' }, done)


    })
  })
})
