'use strict'

var { describe, it } = require('node:test')

var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.path', function(){
    it('should return the parsed pathname', function (t) {
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
          res.end(req.path);
        });

        request(app)
      .get('/login?redirect=/post/1/comments')
      .expect('/login', done);


      })
    })
  })
})
