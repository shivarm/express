'use strict'

var { describe, it } = require('node:test')

var express = require('../')
  , request = require('supertest');

describe('OPTIONS', function(){
  it('should default to the routes defined', function (t) {
    return new Promise(function (resolve, reject) {
      var done = function (err) {
        if (err) {
          reject(err)
          return
        }
        resolve()
      }

      var app = express();

      app.post('/', function(){});
      app.get('/users', function(req, res){});
      app.put('/users', function(req, res){});

      request(app)
    .options('/users')
    .expect('Allow', 'GET, HEAD, PUT')
    .expect(200, 'GET, HEAD, PUT', done);


    })
  })

  it('should only include each method once', function (t) {
    return new Promise(function (resolve, reject) {
      var done = function (err) {
        if (err) {
          reject(err)
          return
        }
        resolve()
      }

      var app = express();

      app.delete('/', function(){});
      app.get('/users', function(req, res){});
      app.put('/users', function(req, res){});
      app.get('/users', function(req, res){});

      request(app)
    .options('/users')
    .expect('Allow', 'GET, HEAD, PUT')
    .expect(200, 'GET, HEAD, PUT', done);


    })
  })

  it('should not be affected by app.all', function (t) {
    return new Promise(function (resolve, reject) {
      var done = function (err) {
        if (err) {
          reject(err)
          return
        }
        resolve()
      }

      var app = express();

      app.get('/', function(){});
      app.get('/users', function(req, res){});
      app.put('/users', function(req, res){});
      app.all('/users', function(req, res, next){
        res.setHeader('x-hit', '1');
        next();
      });

      request(app)
    .options('/users')
    .expect('x-hit', '1')
    .expect('Allow', 'GET, HEAD, PUT')
    .expect(200, 'GET, HEAD, PUT', done);


    })
  })

  it('should not respond if the path is not defined', function (t) {
    return new Promise(function (resolve, reject) {
      var done = function (err) {
        if (err) {
          reject(err)
          return
        }
        resolve()
      }

      var app = express();

      app.get('/users', function(req, res){});

      request(app)
    .options('/other')
    .expect(404, done);


    })
  })

  it('should forward requests down the middleware chain', function (t) {
    return new Promise(function (resolve, reject) {
      var done = function (err) {
        if (err) {
          reject(err)
          return
        }
        resolve()
      }

      var app = express();
      var router = new express.Router();

      router.get('/users', function(req, res){});
      app.use(router);
      app.get('/other', function(req, res){});

      request(app)
    .options('/other')
    .expect('Allow', 'GET, HEAD')
    .expect(200, 'GET, HEAD', done);


    })
  })

  describe('when error occurs in response handler', function () {
    it('should pass error to callback', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        var app = express();
        var router = express.Router();

        router.get('/users', function(req, res){});

        app.use(function (req, res, next) {
          res.writeHead(200);
          next();
        });
        app.use(router);
        app.use(function (err, req, res, next) {
          res.end('true');
        });

        request(app)
      .options('/users')
      .expect(200, 'true', done)


      })
    })
  })
})

describe('app.options()', function(){
  it('should override the default behavior', function (t) {
    return new Promise(function (resolve, reject) {
      var done = function (err) {
        if (err) {
          reject(err)
          return
        }
        resolve()
      }

      var app = express();

      app.options('/users', function(req, res){
        res.set('Allow', 'GET');
        res.send('GET');
      });

      app.get('/users', function(req, res){});
      app.put('/users', function(req, res){});

      request(app)
    .options('/users')
    .expect('GET')
    .expect('Allow', 'GET', done);


    })
  })
})
