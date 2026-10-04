var { describe, it } = require('node:test')


var request = require('supertest')
  , app = require('../../examples/route-map');

describe('route-map', function(){
  describe('GET /users', function(){
    it('should respond with users', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(app)
      .get('/users')
      .expect('user list', done);


      })
    })
  })

  describe('DELETE /users', function(){
    it('should delete users', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(app)
      .del('/users')
      .expect('delete users', done);


      })
    })
  })

  describe('GET /users/:id', function(){
    it('should get a user', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(app)
      .get('/users/12')
      .expect('user 12', done);


      })
    })
  })

  describe('GET /users/:id/pets', function(){
    it('should get a users pets', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(app)
      .get('/users/12/pets')
      .expect('user 12\'s pets', done);


      })
    })
  })

  describe('GET /users/:id/pets/:pid', function(){
    it('should get a users pet', function (t) {
      return new Promise(function (resolve, reject) {
        var done = function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        }

        request(app)
      .del('/users/12/pets/2')
      .expect('delete 12\'s pet 2', done);


      })
    })
  })
})
