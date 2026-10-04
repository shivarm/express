'use strict'

var { describe, it } = require('node:test')

var express = require('..');
var request = require('supertest');

describe('res', function(){
  describe('.links(obj)', function(){
    it('should set Link header field', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        var app = express();

        app.use(function (req, res) {
          res.links({
            next: 'http://api.example.com/users?page=2',
            last: 'http://api.example.com/users?page=5'
          });
          res.end();
        });

        request(app)
      .get('/')
      .expect('Link', '<http://api.example.com/users?page=2>; rel="next", <http://api.example.com/users?page=5>; rel="last"')
      .expect(200, done);


      })
    })

    it('should set Link header field for multiple calls', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        var app = express();

        app.use(function (req, res) {
          res.links({
            next: 'http://api.example.com/users?page=2',
            last: 'http://api.example.com/users?page=5'
          });

          res.links({
            prev: 'http://api.example.com/users?page=1'
          });

          res.end();
        });

        request(app)
      .get('/')
      .expect('Link', '<http://api.example.com/users?page=2>; rel="next", <http://api.example.com/users?page=5>; rel="last", <http://api.example.com/users?page=1>; rel="prev"')
      .expect(200, done);


      })
    })

    it('should set multiple links for single rel', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        var app = express();

        app.use(function (req, res) {
          res.links({
            next: 'http://api.example.com/users?page=2',
            last: ['http://api.example.com/users?page=5', 'http://api.example.com/users?page=1']
          });

          res.end();
        });

        request(app)
      .get('/')
      .expect('Link', '<http://api.example.com/users?page=2>; rel="next", <http://api.example.com/users?page=5>; rel="last", <http://api.example.com/users?page=1>; rel="last"')
      .expect(200, done);


      })
    })
  })
})
