import http from 'k6/http';
import { Counter, Trend } from 'k6/metrics';

const N_REQUESTS = 5;

const crocosCounter = new Counter('crocos_found');
const crocosAge = new Trend('crocos_age');

export default function () {
  for (let i = 0; i < N_REQUESTS; i++) {
    const resp = http.get('https://test-api.k6.io/public/crocodiles/' + rand10());
    if (resp.status === 200) {
        crocosCounter.add(1);
        crocosAge.add(resp.json('age'));
    }
  }
}

function rand10() {
    return Math.floor(Math.random() * 10);
}