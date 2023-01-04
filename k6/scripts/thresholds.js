import { check } from 'k6';
import http from 'k6/http';

export const options = {
    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<200'],
        checks: ['rate==1.0'],
    }
};

export default function () {
    const res = http.get('http://test.k6.io/');
    
    check(res, {
        'is status 200': (r) =>
            r.status === 200,
        'verify homepage text': (r) =>
            r.body.includes('Collection of simple web-pages suitable for load testing'),
        'body size is 11,105 bytes': (r) =>
            r.body.length == 11105,
    });
}
