'use strict'

var { describe, it } = require('node:test')

var express = require('../')
  , request = require('supertest');

describe('throw after .end()', function(){
  it('should fail gracefully', function (t) {
    return new Promise(function (resolve, reject) {
      var done = function (err) {
        if (err) {
          reject(err)
          return
        }
        resolve()
      }

      var app = express();

      app.get('/', function(req, res){
        res.end('yay');
        throw new Error('boom');
      });

      request(app)
    .get('/')
    .expect('yay')
    .expect(200, done);


    })
  })
})
