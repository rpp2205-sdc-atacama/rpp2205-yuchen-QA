const request = require('supertest');
// const express = require('express');
// const router = require('../server/router.js');
const app = require('../server/index.js');
const mockData = require('./__mockData__.js');

describe('Testing api', () => {

  beforeEach(() => {
    //questions = mockData.questions;
    app.locals.answers = mockData.answers;
    app.locals.photos = mockData.photos;
    app.locals.questions = mockData.questions;
  });

  describe("get /qa/questions/", () => {
    it('Should return 200', async() => {
      const response = await request(app).get('/qa/questions').query({product_id:'1'});
      expect(response.status).toBe(200);
      expect(response.data.product_id).toBe(1);
    })
  })
  // describe("get /qa/questions/1/answers", () => {
  //   it('Should return 200', async() => {
  //     const response = await request(app).get('/qa/questions/1/answers');
  //     expect(response.status).toBe(200);
  //   })
  // })
  // describe("post /qa/questions/", () => {
  //   it('Should return 201', async() => {
  //     const body = {
  //       product_id: 1,
  //       name: 'jest-test',
  //       email: 'jest@jest.com',
  //       body: 'this is a test from jest test'
  //     }
  //     const response = await request(app).post('/qa/questions/').send(body);
  //     expect(response.status).toBe(201);
  //   })
  // })
  // describe("post /qa/questions/1/answers", () => {
  //   it('Should return 201', async() => {
  //     const response = await request(app).post('/qa/questions/1/answers');
  //     expect(response.status).toBe(201);
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
