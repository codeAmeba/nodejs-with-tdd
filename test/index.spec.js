const app = require('../index');
const request = require('supertest');

describe('GET .users is', () => {
  it('...', (done) => {
    request(app).get('/users').end((err, res) => {
      console.log(res.body);
      done();
    })
  })
})