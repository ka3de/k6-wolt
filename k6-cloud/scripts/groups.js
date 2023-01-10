import http from 'k6/http';
import { group, sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';

export const options = {
    stages: [
        { duration: '20s', target: 10 },
        { duration: '20s', target: 10 },
        { duration: '20s', target: 0 },
    ],
    thresholds: {
        'crocos_found': [
          'count > 100',
        ]
    },
};

const N_REQUESTS = 5;

const crocosCounter = new Counter('crocos_found');
const crocosAge = new Trend('crocos_age');

export default function () {
    http.get('https://test.k6.io');
    sleep(2);

    group('get crocodiles', function() {
        for (let i = 0; i < N_REQUESTS; i++) {
            const resp = http.get('https://test-api.k6.io/public/crocodiles/' + rand10());
            if (resp.status === 200) {
                crocosCounter.add(1);
                crocosAge.add(resp.json('age'));
            }
            sleep(1);
        }
    });
}

function rand10() {
    return Math.floor(Math.random() * 10);
}
