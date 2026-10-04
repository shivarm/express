const { describe, it } = require('node:test');
var app = require('../../examples/auth')
var request = require('supertest')

function getCookie(res) {
  return res.headers['set-cookie'][0].split(';')[0];
}

describe('auth', function(){
  describe('GET /', function(){
    it('should redirect to /login', async function(){
      await request(app)
        .get('/')
        .expect('Location', '/login')
        .expect(302);
    })
  })

  describe('GET /login', function(){
    it('should render login form', async function(){
      await request(app)
        .get('/login')
        .expect(200, /<form/);
    })

    it('should display login error for bad user', async function () {
      const res = await request(app)
        .post('/login')
        .type('urlencoded')
        .send('username=not-tj&password=foobar')
        .expect('Location', '/login')
        .expect(302);

      await request(app)
        .get('/login')
        .set('Cookie', getCookie(res))
        .expect(200, /Authentication failed/);
    })

    it('should display login error for bad password', async function () {
      const res = await request(app)
        .post('/login')
        .type('urlencoded')
        .send('username=tj&password=nogood')
        .expect('Location', '/login')
        .expect(302);

      await request(app)
        .get('/login')
        .set('Cookie', getCookie(res))
        .expect(200, /Authentication failed/);
    })
  })

  describe('GET /logout', function(){
    it('should redirect to /', async function(){
      await request(app)
        .get('/logout')
        .expect('Location', '/')
        .expect(302);
    })
  })

  describe('GET /restricted', function(){
    it('should redirect to /login without cookie', async function(){
      await request(app)
        .get('/restricted')
        .expect('Location', '/login')
        .expect(302);
    })

    it('should succeed with proper cookie', async function(){
      const res = await request(app)
        .post('/login')
        .type('urlencoded')
        .send('username=tj&password=foobar')
        .expect('Location', '/')
        .expect(302);

      await request(app)
        .get('/restricted')
        .set('Cookie', getCookie(res))
        .expect(200);
    })
  })

  describe('POST /login', function(){
    it('should fail without proper username', async function(){
      await request(app)
        .post('/login')
        .type('urlencoded')
        .send('username=not-tj&password=foobar')
        .expect('Location', '/login')
        .expect(302);
    })

    it('should fail without proper password', async function(){
      await request(app)
        .post('/login')
        .type('urlencoded')
        .send('username=tj&password=baz')
        .expect('Location', '/login')
        .expect(302);
    })

    it('should succeed with proper credentials', async function(){
      await request(app)
        .post('/login')
        .type('urlencoded')
        .send('username=tj&password=foobar')
        .expect('Location', '/')
        .expect(302);
    })
  })
})
