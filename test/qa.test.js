const request = require('supertest');
const { Client } = require('pg');
const app = require('../server/index.js');
const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PW
});

describe('Testing api', () => {
  afterAll(() => {
    client.connect()
      .then(() => client.query(`DELETE FROM questions WHERE question_id > 3518963`))
      .then(() => client.query(`DELETE FROM answers WHERE answer_id > 6879306`))
      .then(() => client.query(`DELETE FROM photos WHERE photo_id > 2063759`))
      .then(() => client.end())
      .catch(err => console.error('test connect db', err.stack));

  })
  describe("get /qa/questions/", () => {
    it('Should return 200', async() => {
      const response = await request(app).get('/qa/questions').query({product_id:'1'});
      expect(response.status).toBe(200);
      expect(response.body.product_id).toBe(1);
      expect(response.body.results.length).toBe(5);
    })
  });
  describe("get /qa/questions/1/answers", () => {
    it('Should return 200', async() => {
      const response = await request(app).get('/qa/questions/1/answers');
      expect(response.status).toBe(200);
    })
  });
  describe("post /qa/questions/", () => {
    it('Should return 201', async() => {
      const body = {
        product_id: '1',
        name: 'jest-test',
        email: 'jest@jest.com',
        body: 'this is a test from jest test'
      }
      const response = await request(app).post('/qa/questions/').send(body);
      expect(response.status).toBe(201);
      expect(response.text).toEqual('new question added!');
    })
    it('Should return 400 if body not fit the server', async() => {
      const body = {name: 'test-jset'}
      const response = await request(app).post('/qa/questions').send(body);
      expect(response.status).toBe(400);
    })
  })
  describe("post /qa/questions/1/answers", () => {
    it('Should return 201', async() => {
      const answer = {
        name: 'jest-test',
        email: 'jest@jest.com',
        body: 'answer mock from jest',
        photos:[]
      }
      const response = await request(app).post('/qa/questions/1/answers').query({question_id:'1'}).send(answer);
      expect(response.status).toBe(201);
      expect(response.text).toBe('added new answers without photos')
    })
    it('Should return 201 with photos', async() => {
      const answer = {
        name: 'jest-test',
        email: 'jest@jest.com',
        body: 'this is a answer mock from jest',
        photos: ['url1', 'url2']
      }
      const response = await request(app).post('/qa/questions/1/answers').query({question_id:'1'}).send(answer);
      expect(response.status).toBe(201);
      expect(response.text).toBe('added new answers with photos')
    })
  })
  // describe("get /qa/questions/1/answers", () => {
  //   it('Should return 200', async() => {
  //     const response = await request(app).get('/qa/questions/1/answers');
  //     expect(response.status).toBe(200);
  //   })
  // })
  // describe("get /qa/questions/1/answers", () => {
  //   it('Should return 200', async() => {
  //     const response = await request(app).get('/qa/questions/1/answers');
  //     expect(response.status).toBe(200);
  //   })
  // })
  // describe("get /qa/questions/1/answers", () => {
  //   it('Should return 200', async() => {
  //     const response = await request(app).get('/qa/questions/1/answers');
  //     expect(response.status).toBe(200);
  //   })
  // })
  // describe("get /qa/questions/1/answers", () => {
  //   it('Should return 200', async() => {
  //     const response = await request(app).get('/qa/questions/1/answers');
  //     expect(response.status).toBe(200);
  //   })
  // })
  // describe("put /qa/questions/1/helpful", () => {
  //   it('Should return 200', async() => {
  //     const response = await request(app).put('/qa/questions/1/helpful');
  //     expect(response.status).toBe(204);
  //   })
  // })
});
