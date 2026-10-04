'use strict'

var { describe, it } = require('node:test')

var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.acceptsLanguages', function(){
    it('should return language if accepted', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        var app = express();

        app.get('/', function (req, res) {
          res.send({
            'en-us': req.acceptsLanguages('en-us'),
            en: req.acceptsLanguages('en')
          })
        })

        request(app)
        .get('/')
        .set('Accept-Language', 'en;q=.5, en-us')
        .expect(200, { 'en-us': 'en-us', en: 'en' }, done)


      })
    })

    it('should be false if language not accepted', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        var app = express();

        app.get('/', function (req, res) {
          res.send({
            es: req.acceptsLanguages('es')
          })
        })

        request(app)
        .get('/')
        .set('Accept-Language', 'en;q=.5, en-us')
        .expect(200, { es: false }, done)


      })
    })

    describe('when Accept-Language is not present', function(){
      it('should always return language', function (t) {
        return new Promise(function (resolve, reject) {
          var done = function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          }

          var app = express();

          app.get('/', function (req, res) {
            res.send({
              en: req.acceptsLanguages('en'),
              es: req.acceptsLanguages('es'),
              jp: req.acceptsLanguages('jp')
            })
          })

          request(app)
          .get('/')
          .expect(200, { en: 'en', es: 'es', jp: 'jp' }, done)


        })
      })
    })
  })
})
