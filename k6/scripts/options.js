import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    noConnectionReuse: __ENV.CONN_REUSE ? true : false,
    userAgent: 'k6-wolt',
    stages: [
        { duration: '10s', target: 10 },
        { duration: '10s', target: 20 },
        { duration: '20s', target: 0 },
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<200'],
    },
    tags: {
        name: 'k6-wolt',
    }
};

export default function () {
    const res = http.get('http://test.k6.io/');
    sleep(1);
}
