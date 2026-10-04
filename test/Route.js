'use strict'

var { describe, it } = require('node:test')

var after = require('after');
var assert = require('node:assert')
var express = require('../')
  , Route = express.Route
  , methods = require('../lib/utils').methods

describe('Route', function(){
  it('should work without handlers', function (t) {
    return new Promise(function (resolve, reject) {
      var done = function (err) {
        if (err) {
          reject(err)
          return
        }
        resolve()
      }

      var req = { method: 'GET', url: '/' }
      var route = new Route('/foo')
      route.dispatch(req, {}, done)


    })
  })

  it('should not stack overflow with a large sync stack', { timeout: 5000 }, function (t) {
    return new Promise(function (resolve, reject) {
      var done = function (err) {
        if (err) {
          reject(err)
          return
        }
        resolve()
      }

      var req = { method: 'GET', url: '/' }
      var route = new Route('/foo')

      route.get(function (req, res, next) {
        req.counter = 0
        next()
      })

      for (var i = 0; i < 6000; i++) {
        route.all(function (req, res, next) {
          req.counter++
          next()
        })
      }

      route.get(function (req, res, next) {
        req.called = true
        next()
      })

      route.dispatch(req, {}, function (err) {
        if (err) return done(err)
        assert.ok(req.called)
        assert.strictEqual(req.counter, 6000)
        done()
      })


    })
  })

  describe('.all', function(){
    it('should add handler', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        var req = { method: 'GET', url: '/' };
        var route = new Route('/foo');

        route.all(function(req, res, next) {
          req.called = true;
          next();
        });

        route.dispatch(req, {}, function (err) {
          if (err) return done(err);
          assert.ok(req.called)
          done();
        });


      })
    })

    it('should handle VERBS', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        var count = 0;
        var route = new Route('/foo');
        var cb = after(methods.length, function (err) {
          if (err) return done(err);
          assert.strictEqual(count, methods.length)
          done();
        });

        route.all(function(req, res, next) {
          count++;
          next();
        });

        methods.forEach(function testMethod(method) {
          var req = { method: method, url: '/' };
          route.dispatch(req, {}, cb);
        });


      })
    })

    it('should stack', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        var req = { count: 0, method: 'GET', url: '/' };
        var route = new Route('/foo');

        route.all(function(req, res, next) {
          req.count++;
          next();
        });

        route.all(function(req, res, next) {
          req.count++;
          next();
        });

        route.dispatch(req, {}, function (err) {
          if (err) return done(err);
          assert.strictEqual(req.count, 2)
          done();
        });


      })
    })
  })

  describe('.VERB', function(){
    it('should support .get', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        var req = { method: 'GET', url: '/' };
        var route = new Route('');

        route.get(function(req, res, next) {
          req.called = true;
          next();
        })

        route.dispatch(req, {}, function (err) {
          if (err) return done(err);
          assert.ok(req.called)
          done();
        });


      })
    })

    it('should limit to just .VERB', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        var req = { method: 'POST', url: '/' };
        var route = new Route('');

        route.get(function () {
          throw new Error('not me!');
        })

        route.post(function(req, res, next) {
          req.called = true;
          next();
        })

        route.dispatch(req, {}, function (err) {
          if (err) return done(err);
          assert.ok(req.called)
          done();
        });


      })
    })

    it('should allow fallthrough', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        var req = { order: '', method: 'GET', url: '/' };
        var route = new Route('');

        route.get(function(req, res, next) {
          req.order += 'a';
          next();
        })

        route.all(function(req, res, next) {
          req.order += 'b';
          next();
        });

        route.get(function(req, res, next) {
          req.order += 'c';
          next();
        })

        route.dispatch(req, {}, function (err) {
          if (err) return done(err);
          assert.strictEqual(req.order, 'abc')
          done();
        });


      })
    })
  })

  describe('errors', function(){
    it('should handle errors via arity 4 functions', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        var req = { order: '', method: 'GET', url: '/' };
        var route = new Route('');

        route.all(function(req, res, next){
          next(new Error('foobar'));
        });

        route.all(function(req, res, next){
          req.order += '0';
          next();
        });

        route.all(function(err, req, res, next){
          req.order += 'a';
          next(err);
        });

        route.dispatch(req, {}, function (err) {
          assert.ok(err)
          assert.strictEqual(err.message, 'foobar')
          assert.strictEqual(req.order, 'a')
          done();
        });


      })
    })

    it('should handle throw', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        var req = { order: '', method: 'GET', url: '/' };
        var route = new Route('');

        route.all(function () {
          throw new Error('foobar');
        });

        route.all(function(req, res, next){
          req.order += '0';
          next();
        });

        route.all(function(err, req, res, next){
          req.order += 'a';
          next(err);
        });

        route.dispatch(req, {}, function (err) {
          assert.ok(err)
          assert.strictEqual(err.message, 'foobar')
          assert.strictEqual(req.order, 'a')
          done();
        });


      })
    });

    it('should handle throwing inside error handlers', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        var req = { method: 'GET', url: '/' };
        var route = new Route('');

        route.get(function () {
          throw new Error('boom!');
        });

        route.get(function(err, req, res, next){
          throw new Error('oops');
        });

        route.get(function(err, req, res, next){
          req.message = err.message;
          next();
        });

        route.dispatch(req, {}, function (err) {
          if (err) return done(err);
          assert.strictEqual(req.message, 'oops')
          done();
        });


      })
    });

    it('should handle throw in .all', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        var req = { method: 'GET', url: '/' };
        var route = new Route('');

        route.all(function(req, res, next){
          throw new Error('boom!');
        });

        route.dispatch(req, {}, function(err){
          assert.ok(err)
          assert.strictEqual(err.message, 'boom!')
          done();
        });


      })
    });

    it('should handle single error handler', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        var req = { method: 'GET', url: '/' };
        var route = new Route('');

        route.all(function(err, req, res, next){
          // this should not execute
          throw new Error('should not be called')
        });

        route.dispatch(req, {}, done);


      })
    });
  })
})
