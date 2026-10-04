'use strict'

var { describe, it, before } = require('node:test')

var testApp

var express = require('../')
  , request = require('supertest');

describe('req', function(){
  describe('.xhr', function(){
    before(function () {
      testApp = express()
      testApp.get('/', function (req, res) {
        res.send(req.xhr)
      })
    })

    it('should return true when X-Requested-With is xmlhttprequest', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/')
        .set('X-Requested-With', 'xmlhttprequest')
        .expect(200, 'true', done)


      })
    })

    it('should case-insensitive', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/')
        .set('X-Requested-With', 'XMLHttpRequest')
        .expect(200, 'true', done)


      })
    })

    it('should return false otherwise', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/')
        .set('X-Requested-With', 'blahblah')
        .expect(200, 'false', done)


      })
    })

    it('should return false when not present', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(testApp)
        .get('/')
        .expect(200, 'false', done)


      })
    })
  })
})
