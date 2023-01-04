import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    web_test: {
      executor: 'constant-vus',
      vus: 10,
      duration: '30s',
      gracefulStop: '0s',
      tags: { test_type: 'website' },
      exec: 'webTest',
    },
    api_test: {
      executor: 'ramping-vus',
      startTime: '5s',
      startVUs: 0,
      stages: [
        { target: 10, duration: '15s' },
        { target: 10, duration: '5s' },
        { target: 0, duration: '20s' },
      ],
      tags: { test_type: 'api' },
      env: { CROC_ID: '1' },
      exec: 'apiTest',
    },
  },
  discardResponseBodies: true,
  thresholds: {
    // api test threshold
    'http_req_duration{test_type:api}': ['p(95)<250', 'p(99)<350'],
    'checks{test_type:api}': ['rate==1.0'],
    // web test threshold
    'http_req_duration{test_type:website}': ['p(99)<500'],
    'checks{test_type:website}': ['rate==1.0'],
  },
};

export function webTest() {
  const resp = http.get('https://test.k6.io/contacts.php');
  check(resp, {'web response is 200': (r) => r.status === 200});
  sleep(Math.random() * 2);
}

export function apiTest() {
  const resp = http.get(`https://test-api.k6.io/public/crocodiles/${__ENV.CROC_ID}/`);
  check(resp, {'api response is 200': (r) => r.status === 200});
  sleep(0.5);
}
