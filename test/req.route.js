'use strict'

var { describe, it } = require('node:test')

var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.route', function(){
    it('should be the executed Route', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        var app = express();

        app.get('/user/:id{/:op}', function(req, res, next){
          res.header('path-1', req.route.path)
          next();
        });

        app.get('/user/:id/edit', function(req, res){
          res.header('path-2', req.route.path)
          res.end();
        });

        request(app)
        .get('/user/12/edit')
        .expect('path-1', '/user/:id{/:op}')
        .expect('path-2', '/user/:id/edit')
        .expect(200, done)


      })
    })
  })
})
