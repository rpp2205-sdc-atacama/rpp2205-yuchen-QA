import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1000,
  duration: "30s",
};

export default function () {
  const BASE_URL = 'http://localhost:8000';
  let product_id = Math.floor(Math.random() * 100000) + 900000// make sure this is not production
  let question_id = Math.floor(Math.random() * 1000000);
  //let res = http.get(`${BASE_URL}/qa/questions?product_id=${product_id}`);
  let res = http.batch([
    ['GET', `${BASE_URL}/qa/questions?product_id=${product_id}`],
    ['GET', `${BASE_URL}/qa/questions/${question_id}/answers`]
  ])
  check(res[0], {
    'get questions success': (r) => r.status== 200
  });
  check(res[1], {
    'get answers success': (r) => r.status == 200
  });
  //sleep(1);
}
