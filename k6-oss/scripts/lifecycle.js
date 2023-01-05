import http from 'k6/http';

const nCrocodiles = 4;
const apiURL = 'https://test-api.k6.io/';

const rand = rand10();
console.log(`init context: (rand=${rand})`);

export function setup() {
    console.log(`setup: (rand=${rand})`);
    const crocodiles = new Array();
    for (let i = 0; i < nCrocodiles; i++) {
        crocodiles.push(rand10());
    }
    return { crocodiles: crocodiles };
}

export default function (data) {
    console.log('default function got data: ' + JSON.stringify(data));
    for (let i = 0; i < data.crocodiles.length; i++) {
        const res = http.get(apiURL + 'public/crocodiles/' + data.crocodiles[i]);
        console.log(JSON.stringify(res.body));
    }
}

export function teardown(data) {
    console.log('finishing test');
}

function rand10() {
    return Math.floor(Math.random() * 10);
}