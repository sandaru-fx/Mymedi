const http = require('http');

const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/admin/health',
    method: 'GET',
    headers: {
        'x-demo-admin': 'true',
        'Content-Type': 'application/json'
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('BODY:', data);
    });
});

req.on('error', (e) => {
    console.error(`PROBLEM: ${e.message}`);
});

req.end();
