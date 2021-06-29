require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });


    test('post todos', async() => {

      const expectation = [
        {
          'id': 6,
          'todo': 'walk the dog',
          'completed': false,
          'owner_id': 2
        },
        {
          'id': 7,
          'todo': 'wash the dishes',
          'completed': false,
          'owner_id': 2
        },
        {
          'id': 8,
          'todo': 'complete daily code challenge',
          'completed': false,
          'owner_id': 2
        },
        {
          'id': 9,
          'todo': 'understand regex',
          'completed': false,
          'owner_id': 2
        },
        {
          'id': 10,
          'todo': 'congratulate yourself',
          'completed': false,
          'owner_id': 2
        }
      ];

      for(let todo of expectation) {
        await fakeRequest(app)
          .post('/api/todos')
          .send(todo)
          .set('Authorization', token)
          .expect('Content-Type', /json/)
          .expect(200);
      }

      const data = await fakeRequest(app)
        .get('/api/todos')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(data.body).toEqual(expectation);
    });


    test('get todos', async() => {

      const expectation = [
        {
          'id': 6,
          'todo': 'walk the dog',
          'completed': false,
          'owner_id': 2
        },
        {
          'id': 7,
          'todo': 'wash the dishes',
          'completed': false,
          'owner_id': 2
        },
        {
          'id': 8,
          'todo': 'complete daily code challenge',
          'completed': false,
          'owner_id': 2
        },
        {
          'id': 9,
          'todo': 'understand regex',
          'completed': false,
          'owner_id': 2
        },
        {
          'id': 10,
          'todo': 'congratulate yourself',
          'completed': false,
          'owner_id': 2
        }
      ];

      const data = await fakeRequest(app)
        .get('/api/todos')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(data.body).toEqual(expectation);
    });

    test('put todo', async() => {

      const expectation = [
        {
          'id': 6,
          'todo': 'walk the dog',
          'completed': false,
          'owner_id': 2
        },
        {
          'id': 7,
          'todo': 'wash the dishes',
          'completed': false,
          'owner_id': 2
        },
        {
          'id': 8,
          'todo': 'complete daily code challenge',
          'completed': false,
          'owner_id': 2
        },
        {
          'id': 9,
          'todo': 'understand regex',
          'completed': false,
          'owner_id': 2
        },
        {
          'id': 10,
          'todo': 'congratulate yourself',
          'completed': true,
          'owner_id': 2
        }
      ];

      await fakeRequest(app)
        .put('/api/todos/10')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      const data = await fakeRequest(app)
        .get('/api/todos')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(data.body).toEqual(expectation);
    });

  });
});
