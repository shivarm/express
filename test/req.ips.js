'use strict'

var { describe, it } = require('node:test')

var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.ips', function(){
    describe('when X-Forwarded-For is present', function(){
      describe('when "trust proxy" is enabled', function(){
        it('should return an array of the specified addresses', function (t) {
          return new Promise(function (resolve, reject) {
            var done = function (err) {
              if (err) {
                reject(err)
                return
              }
              resolve()
            }

            var app = express();

            app.enable('trust proxy');

            app.use(function(req, res, next){
              res.send(req.ips);
            });

            request(app)
          .get('/')
          .set('X-Forwarded-For', 'client, p1, p2')
          .expect('["client","p1","p2"]', done);


          })
        })

        it('should stop at first untrusted', function (t) {
          return new Promise(function (resolve, reject) {
            var done = function (err) {
              if (err) {
                reject(err)
                return
              }
              resolve()
            }

            var app = express();

            app.set('trust proxy', 2);

            app.use(function(req, res, next){
              res.send(req.ips);
            });

            request(app)
          .get('/')
          .set('X-Forwarded-For', 'client, p1, p2')
          .expect('["p1","p2"]', done);


          })
        })
      })

      describe('when "trust proxy" is disabled', function(){
        it('should return an empty array', function (t) {
          return new Promise(function (resolve, reject) {
            var done = function (err) {
              if (err) {
                reject(err)
                return
              }
              resolve()
            }

            var app = express();

            app.use(function(req, res, next){
              res.send(req.ips);
            });

            request(app)
          .get('/')
          .set('X-Forwarded-For', 'client, p1, p2')
          .expect('[]', done);


          })
        })
      })
    })

    describe('when X-Forwarded-For is not present', function(){
      it('should return []', function (t) {
        return new Promise(function (resolve, reject) {
          var done = function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          }

          var app = express();

          app.use(function(req, res, next){
            res.send(req.ips);
          });

          request(app)
        .get('/')
        .expect('[]', done);


        })
      })
    })
  })
})
