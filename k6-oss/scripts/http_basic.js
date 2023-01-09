import http from 'k6/http';

const apiURL = 'https://test-api.k6.io'
const crocosEndpoint = '/public/crocodiles/'

export default function() {
    // It would be better to use checks and thersholds instead of "consoling out"
    // everything, but trying to isolate functionalities by now
    
    // Get a few crocodiles
    const responses = http.batch([
        apiURL + crocosEndpoint + '1',
        apiURL + crocosEndpoint + '2',
        apiURL + crocosEndpoint + '3',
    ]);
    responses.forEach(resp => {
        if (resp.status === 200) console.log("got croco: " + JSON.stringify(resp.body));
        else console.log("got unexpected HTTP status: " + resp.status);
    });

    // Register user
    const user = {
        first_name: 'Crocodile',
        last_name: 'Dundee',
        username: 'CrocoDundee' + rand100(),
        password: '4uss1e',
    };
    let resp = http.post(apiURL + '/user/register/', user);
    if (resp.status !== 201) {
        console.log("error registering user")
        return;
    }
    
    // Login
    resp = http.post(apiURL + '/auth/basic/login/', {
        username: user.username,
        password: user.password
    });
    if (resp.status !== 200) console.log('could not log in!')
    else console.log('successfully logged in!');
}

function rand100() {
    return Math.floor(Math.random() * 100);
}
