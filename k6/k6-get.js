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

  group('get questions', () => {
    let res = http.get(`${BASE_URL}/questions?product_id=${product_id}`);
    check(res, {
      'get questions success': (r) => r.status== 200
    });
  });

  group('get Anaswer', () => {
    let res = http.get(`${BASE_URL}/questions/${question_id}/answers`);
    check(res, {
      'get answer success': (r) => r.status== 200
    });
  });

  //sleep(1);
}
