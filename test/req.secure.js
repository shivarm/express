'use strict'

var { describe, it } = require('node:test')

var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.secure', function(){
    describe('when X-Forwarded-Proto is missing', function(){
      it('should return false when http', function (t) {
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
            res.send(req.secure ? 'yes' : 'no');
          });

          request(app)
        .get('/')
        .expect('no', done)


        })
      })
    })
  })

  describe('.secure', function(){
    describe('when X-Forwarded-Proto is present', function(){
      it('should return false when http', function (t) {
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
            res.send(req.secure ? 'yes' : 'no');
          });

          request(app)
        .get('/')
        .set('X-Forwarded-Proto', 'https')
        .expect('no', done)


        })
      })

      it('should return true when "trust proxy" is enabled', function (t) {
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

          app.get('/', function(req, res){
            res.send(req.secure ? 'yes' : 'no');
          });

          request(app)
        .get('/')
        .set('X-Forwarded-Proto', 'https')
        .expect('yes', done)


        })
      })

      it('should return false when initial proxy is http', function (t) {
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

          app.get('/', function(req, res){
            res.send(req.secure ? 'yes' : 'no');
          });

          request(app)
        .get('/')
        .set('X-Forwarded-Proto', 'http, https')
        .expect('no', done)


        })
      })

      it('should return true when initial proxy is https', function (t) {
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

          app.get('/', function(req, res){
            res.send(req.secure ? 'yes' : 'no');
          });

          request(app)
        .get('/')
        .set('X-Forwarded-Proto', 'https, http')
        .expect('yes', done)


        })
      })

      describe('when "trust proxy" trusting hop count', function () {
        it('should respect X-Forwarded-Proto', function (t) {
          return new Promise(function (resolve, reject) {
            var done = function (err) {
              if (err) {
                reject(err)
                return
              }
              resolve()
            }

            var app = express();

            app.set('trust proxy', 1);

            app.get('/', function (req, res) {
              res.send(req.secure ? 'yes' : 'no');
            });

            request(app)
          .get('/')
          .set('X-Forwarded-Proto', 'https')
          .expect('yes', done)


          })
        })
      })
    })
  })
})
