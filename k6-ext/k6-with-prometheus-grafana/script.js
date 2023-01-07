import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

const sleepCounter = new Counter('sleep_time');

export const options = {
  scenarios: {
    sleep_endpoint: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { target: 15, duration: '20s' },
        { target: 15, duration: '20s' },
        { target: 0, duration: '20s' },
      ],
      tags: { endpoint: 'sleep' },
      exec: 'sleepTest',
    },
    count_endpoint: {
      executor: 'constant-vus',
      startTime: '10s',
      vus: 10,
      duration: '40s',
      gracefulStop: '0s',
      tags: { endpoint: 'count' },
      exec: 'countTest',
    },
  },
  thresholds: {
    'checks': ['rate>=0.9'],
    'sleep_time': ['count > 100'],
  }
};

export function sleepTest() {
  const resp = http.get('http://localhost:8080/sleep?t=' + rand5());
  check(resp, {'sleep API response is 200': (r) => r.status === 200});
  sleep(Math.random() * 2);
}

export function countTest() {
  const resp = http.get(`http://localhost:8080/count`);
  check(resp, {'count API response is 200': (r) => r.status === 200});
  if (resp.status === 200 ) sleepCounter.add(resp.json('sleep_time'));
  sleep(2);
}

function rand5() {
  return Math.floor(Math.random() * 5);
}
