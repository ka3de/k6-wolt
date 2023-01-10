import { fail } from 'k6';
import { Httpx } from 'https://jslib.k6.io/httpx/0.0.3/index.js';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const USERNAME = `CrocoDundee${randomIntBetween(1, 100)}`;
const PASSWORD = '4uss1e';

const session = new Httpx({
  baseURL: 'https://test-api.k6.io',
  headers: {
    'User-Agent': 'k6-wolt',
  },
  timeout: 30000,
});

export default function() {
    // Register new user
    console.log("registering user");
    const registrationResp = session.post('/user/register/', {
        first_name: 'Crocodile',
        last_name: 'Dundee',
        username: USERNAME,
        password: PASSWORD,
    });
    if (registrationResp.status !== 201) {
        fail('registration failed');
    }

    // Login
    console.log("login");
    const loginResp = session.post('/auth/token/login/', {
        username: USERNAME,
        password: PASSWORD,
    });
    if (loginResp.status !== 200) {
        fail('authentication failed');
    }

    // Set the authorization header on the session for the subsequent requests
    const authToken = loginResp.json('access');
    session.addHeader('Authorization', `Bearer ${authToken}`);

    // Create a new crocodile
    console.log("creating new crocodile");
    const payload = {
        name: `Croc`,
        sex: 'M',
        date_of_birth: '2023-01-01',
    };
    const respCreateCrocodile = session.post('/my/crocodiles/', payload);
    if (respCreateCrocodile.status !== 201) {
        fail('crocodile creation failed: ' + JSON.stringify(respCreateCrocodile));
        return;
    }

    // Delete crocodile
    console.log("deleting crocodile");
    const crocId = respCreateCrocodile.json('id');
    const respDeleteCrocodile = session.delete(`/my/crocodiles/${crocId}`)
    if (respDeleteCrocodile.status !== 200) {
        fail('crocodile deletion failed: ' + JSON.stringify(respDeleteCrocodile));
    }
}
