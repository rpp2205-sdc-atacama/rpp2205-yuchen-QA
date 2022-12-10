import http from 'k6/http';
import { check, sleep,group } from 'k6';
export const options = {
  vus: 1000,
  duration: "30s",
};

export default function () {
  const BASE_URL = 'http://localhost:8000/qa';
  let question_id = Math.floor(Math.random() * 1000000);
  let mock_question = {product_id:1, name:'k6-tester', email:'test1@gmail.com', body:'Hey THis is a question test body'};
  let mock_answer = {name:'k6-tester', email:'answer1@123.com', body:'answer of 1st question', photos:[]};
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
}