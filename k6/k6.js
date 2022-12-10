import http from 'k6/http';
import { check, sleep,group } from 'k6';
export const options = {
  vus: 1000,
  duration: "30s",
};

export default function () {
  const BASE_URL = 'http://localhost:8000/qa';
  let product_id = Math.floor(Math.random() * 100000) + 900000
  let question_id = Math.floor(Math.random() * 1000000);
  let answer_id = Math.floor(Math.random() * 1000000) + 5000000;
  let mock_question = {product_id:1, name:'k6-tester', email:'test1@gmail.com', body:'Hey THis is a question test body'};
  let mock_answer = {name:'k6-tester', email:'answer1@123.com', body:'answer of 1st question', photos:[]};
  // group('get questions', () => {
  //   let res = http.get(`${BASE_URL}/questions?product_id=${product_id}`);
  //   check(res, {
  //     'get questions success': (r) => r.status== 200
  //   });
  // });
  // group('get Anaswer', () => {
  //   let res = http.get(`${BASE_URL}/questions/${question_id}/answers`);
  //   check(res, {
  //     'get answer success': (r) => r.status== 200
  //   });
  // });
  group('post questions', () => {
    let res = http.post(`${BASE_URL}/questions`, mock_question);
    check(res, {
      'post question success': (r) => r.status== 201
    });
  });
  group('post answers', () => {
    let res = http.post(`${BASE_URL}/questions/${question_id}/answers`, mock_answer);
    check(res, {
      'post answer success': (r) => r.status== 201
    });
  });


  // group('put questions helpful', () => {
  //   let res = http.put(`${BASE_URL}/questions/${question_id}/helpful`);
  //   check(res, {
  //     'success': (r) => r.status== 204
  //   });
  // });
  // group('put questions report', () => {
  //   let res = http.put(`${BASE_URL}/questions/${question_id}/report`);
  //   check(res, {
  //     'success': (r) => r.status== 204
  //   });
  // });
  // group('put answer helpful', () => {
  //   let res = http.put(`${BASE_URL}/answers/${answer_id}/helpful`);
  //   check(res, {
  //     'success': (r) => r.status== 204
  //   });
  // });
  // group('put answers report', () => {
  //   let res = http.put(`${BASE_URL}/answers/${answer_id}/report`);
  //   check(res, {
  //     'success': (r) => r.status == 204
  //   });
  // });


  // let res = http.batch([
  //   ['GET', `${BASE_URL}/questions?product_id=${product_id}`],
  //   ['GET', `${BASE_URL}/questions/${question_id}/answers`],
  //   ['POST', `${BASE_URL}/questions`, mock_question],
  //   ['POST', `${BASE_URL}/questions/${question_id}/answers`, mock_answer],
  //   // ['PUT', `${BASE_URL}/questions/${question_id}/helpful`],
  //   // ['PUT', `${BASE_URL}/questions/${question_id}/report`],
  //   // ['PUT', `${BASE_URL}/answers/${answer_id}/helpful`],
  //   // ['PUT', `${BASE_URL}/answers/${answer_id}/report`],
  // ])
  // check(res[0], {
  //   'get questions success': (r) => r.status== 200
  // });
  // check(res[1], {
  //   'get answers success': (r) => r.status == 200
  // });
  // check(res[2], {
  //   'post questions success': (r) => r.status == 201
  // });
  // check(res[3], {
  //   'post answers success': (r) => r.status == 201
  // });
  // check(res[4], {
  //   'update helpful of questions success': (r) => r.status == 204
  // });
  // check(res[5], {
  //   'update report of questions success': (r) => r.status == 204
  // });
  // check(res[6], {
  //   'update helpful of answers success': (r) => r.status == 204
  // });
  // check(res[7], {
  //   'update report of answers success': (r) => r.status == 204
  // });
  //sleep(1);
}
