import http from 'k6/http';
import { check, sleep,group } from 'k6';
export const options = {
  vus: 1000,
  duration: "30s",
};

export default function () {
  const BASE_URL = 'http://localhost:8000/qa';
  let question_id = Math.floor(Math.random() * 1000000);
  let answer_id = Math.floor(Math.random() * 1000000) + 5000000;

  group('put questions helpful', () => {
    let res = http.put(`${BASE_URL}/questions/${question_id}/helpful`);
    check(res, {
      'success': (r) => r.status== 204
    });
  });
  group('put questions report', () => {
    let res = http.put(`${BASE_URL}/questions/${question_id}/report`);
    check(res, {
      'success': (r) => r.status== 204
    });
  });
  group('put answer helpful', () => {
    let res = http.put(`${BASE_URL}/answers/${answer_id}/helpful`);
    check(res, {
      'success': (r) => r.status== 204
    });
  });
  group('put answers report', () => {
    let res = http.put(`${BASE_URL}/answers/${answer_id}/report`);
    check(res, {
      'success': (r) => r.status == 204
    });
  });
}